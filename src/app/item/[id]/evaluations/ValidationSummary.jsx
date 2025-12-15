import { FaTimesCircle, FaExclamationCircle } from "react-icons/fa";

export default function ValidationSummary({ warnings, errors }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 flex items-center gap-2">
      <div>
        <div className="border-2 bg-red-50 px-3 py-2 border-red-500 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Errors
          </div>
          <div className="text-base flex items-center gap-1 font-semibold text-gray-900">
            <FaTimesCircle className="text-red-500 h-5 w-5" />
            {errors ? errors : "loading"}
          </div>
        </div>
      </div>
      <div>
        <div className="border-2 px-3 py-2 bg-orange-50 border-yellow-600 rounded-2xl">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Warnings
          </div>
          <div className="text-base flex items-center gap-1 font-semibold text-gray-900">
            <FaExclamationCircle className="text-yellow-500 h-5 w-5" />
            {warnings ? warnings : "loading"}
          </div>
        </div>
      </div>
      <div className="ms-5">
        <h3 className="text-xs font-semibold text-gray-500">
          VALIDATION
        </h3>
        <p className="text-xs mt-1 text-gray-700">W3C validation errors & warnings</p>
      </div>
    </div>
  );
}
