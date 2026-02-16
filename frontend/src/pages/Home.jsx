import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiGithub, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { uploadZipFile, uploadGithubRepo } from '../services/api';
import { FILE_UPLOAD, ERROR_MESSAGES, EXAMPLE_QUESTIONS } from '../utils/constants';
import { isValidGithubUrl, formatFileSize } from '../utils/helpers';

// ---------- Helper Components ----------

const LoadingSpinner = () => (
  <FiLoader className="animate-spin" />
);

const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200"
    >
      <FiAlertCircle className="mt-0.5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

const UploadToggle = ({ uploadType, setUploadType }) => (
  <div
    role="tablist"
    className="inline-flex bg-gray-100 p-1 rounded-full mb-8"
  >
    <button
      role="tab"
      aria-selected={uploadType === 'zip'}
      onClick={() => setUploadType('zip')}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
        uploadType === 'zip'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <FiUpload />
      ZIP File
    </button>
    <button
      role="tab"
      aria-selected={uploadType === 'github'}
      onClick={() => setUploadType('github')}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all ${
        uploadType === 'github'
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <FiGithub />
      GitHub
    </button>
  </div>
);

const ZipUploader = ({ loading, onFileAccepted }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFileAccepted(acceptedFiles[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/zip': ['.zip'] },
    multiple: false,
    maxSize: FILE_UPLOAD.MAX_SIZE,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragActive
          ? 'border-blue-500 bg-blue-50/50 scale-[1.02]'
          : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
        }
        ${loading ? 'pointer-events-none opacity-70' : ''}
      `}
    >
      <input {...getInputProps()} />
      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner />
          <p className="text-sm text-gray-500">Uploading and analyzing…</p>
        </div>
      ) : (
        <>
          <FiUpload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          {isDragActive ? (
            <p className="text-sm text-gray-700">Drop the file here</p>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-1">
                Drag and drop your <span className="font-semibold">.zip</span> file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Maximum size: {formatFileSize(FILE_UPLOAD.MAX_SIZE)}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

const GithubForm = ({ loading, onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="github-url" className="block text-sm font-medium text-gray-700 mb-1.5">
          Repository URL
        </label>
        <input
          id="github-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repository"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition"
          disabled={loading}
        />
        <p className="mt-2 text-xs text-gray-500">Public repositories only</p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Cloning…
          </>
        ) : (
          'Clone & Analyze'
        )}
      </button>
    </form>
  );
};

const ExampleQuestions = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-base font-semibold text-gray-900 mb-3">
      Example questions you can ask
    </h3>
    <ul className="space-y-2">
      {EXAMPLE_QUESTIONS.map((q, i) => (
        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
          <span className="text-blue-600 mt-0.5">→</span>
          <span>“{q}”</span>
        </li>
      ))}
    </ul>
  </div>
);

// ---------- Main Home Component ----------

function Home() {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('zip');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileAccepted = async (file) => {
    // Validate file
    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      setError(ERROR_MESSAGES.FILE_TOO_LARGE);
      return;
    }
    if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
      setError(ERROR_MESSAGES.INVALID_FILE_TYPE);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await uploadZipFile(file);
      localStorage.setItem('codebaseId', data.codebaseId);
      navigate('/qa');
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.UPLOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSubmit = async (url) => {
    if (!isValidGithubUrl(url)) {
      setError(ERROR_MESSAGES.GITHUB_INVALID);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await uploadGithubRepo(url);
      localStorage.setItem('codebaseId', data.codebaseId);
      navigate('/qa');
    } catch (err) {
      setError(err.message || 'Failed to clone repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Codebase Q&A
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upload your codebase and ask questions in plain English. Get answers with exact file paths and code references.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <UploadToggle uploadType={uploadType} setUploadType={setUploadType} />
          <ErrorAlert error={error} />

          {uploadType === 'zip' ? (
            <ZipUploader loading={loading} onFileAccepted={handleFileAccepted} />
          ) : (
            <GithubForm loading={loading} onSubmit={handleGithubSubmit} />
          )}
        </div>

        {/* Example Questions */}
        <div className="mt-8">
          <ExampleQuestions />
        </div>
      </div>
    </div>
  );
}

export default Home;