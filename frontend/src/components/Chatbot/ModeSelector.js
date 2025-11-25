import React from 'react';

const ModeSelector = ({ currentMode, onModeChange, isOpen, onToggle }) => {
  const modes = [
    { 
      id: 'developer', 
      name: 'Developer', 
      icon: '💻', 
      description: 'Technical guidance & code help',
      color: '#60a5fa'
    },
    { 
      id: 'designer', 
      name: 'Designer', 
      icon: '🎨', 
      description: 'UI/UX insights & design tips',
      color: '#ec4899'
    },
    { 
      id: 'mentor', 
      name: 'Mentor', 
      icon: '🧑‍🏫', 
      description: 'Career guidance & learning paths',
      color: '#22c55e'
    },
    { 
      id: 'career', 
      name: 'Career Assistant', 
      icon: '💼', 
      description: 'Job search & interview prep',
      color: '#f59e0b'
    },
    { 
      id: 'resume', 
      name: 'Resume Reviewer', 
      icon: '📄', 
      description: 'Resume analysis & ATS optimization',
      color: '#a855f7'
    }
  ];

  const currentModeData = modes.find(mode => mode.id === currentMode) || modes[0];

  return (
    <div className="mode-selector">
      {/* Current Mode Display */}
      <div className="mode-current" onClick={onToggle}>
        <div className="mode-indicator">
          <span className="mode-icon">{currentModeData.icon}</span>
          <span className="mode-name">{currentModeData.name}</span>
          <span className={`mode-chevron ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mode-dropdown">
          <div className="mode-dropdown-header">
            <span>Choose Assistant Mode</span>
          </div>
          {modes.map(mode => (
            <div
              key={mode.id}
              className={`mode-option ${mode.id === currentMode ? 'active' : ''}`}
              onClick={() => {
                onModeChange(mode.id);
                onToggle();
              }}
              style={{ '--mode-color': mode.color }}
            >
              <div className="mode-option-content">
                <div className="mode-option-header">
                  <span className="mode-option-icon">{mode.icon}</span>
                  <span className="mode-option-name">{mode.name}</span>
                </div>
                <span className="mode-option-description">{mode.description}</span>
              </div>
              {mode.id === currentMode && (
                <div className="mode-active-indicator">✓</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModeSelector;