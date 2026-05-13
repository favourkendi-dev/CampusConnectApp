import { useState } from 'react';
import { Accessibility, Type, Contrast, Eye, Volume2, Keyboard } from 'lucide-react';
import { useAccessibility } from '../hooks/useAccessibility';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting } = useAccessibility();

  const options = [
    { key: 'highContrast', label: 'High Contrast', icon: Contrast, description: 'Increase color contrast' },
    { key: 'largeText', label: 'Large Text', icon: Type, description: 'Increase font size by 25%' },
    { key: 'reducedMotion', label: 'Reduced Motion', icon: Eye, description: 'Minimize animations' },
    { key: 'screenReaderOptimized', label: 'Screen Reader', icon: Volume2, description: 'Optimize for screen readers' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Accessibility options"
      >
        <Accessibility className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <h3 className="font-semibold text-gray-900 mb-3">Accessibility</h3>
          
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.key} className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <option.icon className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting(option.key, !settings[option.key])}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    settings[option.key] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      settings[option.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <label className="text-sm font-medium text-gray-700">Color Blind Mode</label>
            <select
              value={settings.colorBlindMode}
              onChange={(e) => updateSetting('colorBlindMode', e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="none">None</option>
              <option value="protanopia">Protanopia (Red-blind)</option>
              <option value="deuteranopia">Deuteranopia (Green-blind)</option>
              <option value="tritanopia">Tritanopia (Blue-blind)</option>
            </select>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <Keyboard className="w-4 h-4" />
            <span>Press Alt+A to toggle this menu</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;