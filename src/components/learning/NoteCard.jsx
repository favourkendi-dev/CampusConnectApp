import { Download, Star, Eye, FileText, User } from 'lucide-react';

const NoteCard = ({ note, onDownload, onRate }) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-secondary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{note.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <User className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{note.authorName}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {note.tags?.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{note.downloads || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{note.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-secondary-500" />
              <span>{note.rating || 0}</span>
            </div>
          </div>
          <span className="text-xs">{note.courseCode}</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onDownload(note.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onRate(note.id)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;