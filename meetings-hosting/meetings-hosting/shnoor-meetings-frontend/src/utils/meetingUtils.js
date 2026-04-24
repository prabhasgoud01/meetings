export const getMeetingPreferences = () => {
    const prefs = localStorage.getItem('shnoor-meeting-preferences');
    return prefs ? JSON.parse(prefs) : {
        theme: 'light',
        language: 'english',
        microphoneEnabled: true,
        cameraEnabled: true,
        microphoneId: 'default',
        cameraId: 'default',
        hardwareAcceleration: true
    };
};

export const saveMeetingPreferences = (nextValue) => {
    const currentPreferences = getMeetingPreferences();
    const updatedPreferences = { ...currentPreferences, ...nextValue };
    localStorage.setItem('shnoor-meeting-preferences', JSON.stringify(updatedPreferences));
    
    // Dispatch custom event for cross-component synchronization
    window.dispatchEvent(new CustomEvent('meeting-preferences-updated', { 
        detail: updatedPreferences 
    }));
    
    return updatedPreferences;
};

export const applyThemePreference = (theme) => {
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
};

const translations = {
    english: {
        meetings: 'Meetings',
        calls: 'Calls',
        calendar: 'Calendar',
        help: 'Help',
        helpSubtext: 'Support and Guidance',
        joinMeetingHelp: 'How to join a meeting',
        joinMeetingHelpText: 'Enter a code or use a meeting link to join.',
        presentHelp: 'How to present',
        presentHelpText: 'Click the "Present now" button in the meeting room.',
        moreAssistance: 'Need more help?',
        chatbotSupport: 'Chat with Shnoor Assistant',
        settings: 'Settings',
        audioVideo: 'Audio & Video',
        defaultMicrophone: 'Default Microphone',
        defaultCamera: 'Default Camera',
        systemDefault: 'System Default',
        on: 'On',
        off: 'Off',
        select: 'Select',
        hardwareAcceleration: 'Hardware Acceleration',
        enabledForPerformance: 'Enabled (Recommended for performance)',
        disabled: 'Disabled',
        language: 'Language',
        hindi: 'Hindi',
        english: 'English',
        theme: 'Theme',
        darkTheme: 'Dark Mode',
        lightTheme: 'Light Mode',
        default: 'Default'
    },
    hindi: {
        meetings: 'बैठकें',
        calls: 'कॉल',
        calendar: 'कैलेंडर',
        help: 'सहायता',
        helpSubtext: 'समर्थन और मार्गदर्शन',
        joinMeetingHelp: 'मीटिंग में कैसे शामिल हों',
        joinMeetingHelpText: 'शामिल होने के लिए कोड दर्ज करें या मीटिंग लिंक का उपयोग करें।',
        presentHelp: 'कैसे प्रस्तुत करें',
        presentHelpText: 'मीटिंग रूम में "अभी प्रस्तुत करें" बटन पर क्लिक करें।',
        moreAssistance: 'और सहायता चाहिए?',
        chatbotSupport: 'शन्नूर सहायक के साथ चैट करें',
        settings: 'सेटिंग्स',
        audioVideo: 'ऑडियो और वीडियो',
        defaultMicrophone: 'डिफ़ॉल्ट माइक्रोफ़ोन',
        defaultCamera: 'डिफ़ॉल्ट कैमरा',
        systemDefault: 'सिस्टम डिफ़ॉल्ट',
        on: 'चालू',
        off: 'बंद',
        select: 'चुनें',
        hardwareAcceleration: 'हार्डवेयर त्वरण',
        enabledForPerformance: 'सक्षम (प्रदर्शन के लिए अनुशंसित)',
        disabled: 'अक्षम',
        language: 'भाषा',
        hindi: 'हिंदी',
        english: 'अंग्रेज़ी',
        theme: 'थीम',
        darkTheme: 'डार्क मोड',
        lightTheme: 'लाइट मोड',
        default: 'डिफ़ॉल्ट'
    }
};

export const getTranslator = (language) => {
    const lang = language || 'english';
    return (key) => translations[lang]?.[key] || key;
};

export const getCallHistory = () => {
    const history = localStorage.getItem('shnoor-call-history');
    return history ? JSON.parse(history) : [];
};

export const saveCallHistory = (history) => {
    localStorage.setItem('shnoor-call-history', JSON.stringify(history));
};

export const upsertCallHistoryEntry = (entry) => {
    const history = getCallHistory();
    const index = history.findIndex(e => e.sessionId === entry.sessionId);
    if (index >= 0) {
        history[index] = { ...history[index], ...entry };
    } else {
        history.unshift(entry);
    }
    saveCallHistory(history);
};

export const closeCallHistoryEntry = (sessionId) => {
    const history = getCallHistory();
    const index = history.findIndex(e => e.sessionId === sessionId);
    if (index >= 0 && !history[index].exitTime) {
        const exitTime = new Date().toISOString();
        const entryTime = new Date(history[index].entryTime).getTime();
        const durationMs = new Date(exitTime).getTime() - entryTime;
        history[index] = { ...history[index], exitTime, durationMs };
        saveCallHistory(history);
    }
};

export const removeCallHistoryEntry = (sessionId) => {
    const history = getCallHistory();
    const updatedHistory = history.filter(e => e.sessionId !== sessionId);
    saveCallHistory(updatedHistory);
};

export const formatDateTime = (isoString) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};

export const formatDuration = (ms) => {
    if (!ms || ms < 0) return '0s';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    return parts.join(' ');
};

export const getPreJoinMediaState = (roomId) => {
    const state = sessionStorage.getItem(`prejoin_media_${roomId}`);
    return state ? JSON.parse(state) : { audioEnabled: true, videoEnabled: true };
};

export const savePreJoinMediaState = (roomId, state) => {
    sessionStorage.setItem(`prejoin_media_${roomId}`, JSON.stringify(state));
};

export const getPreferredMediaConstraints = () => {
    const prefs = getMeetingPreferences();
    return {
        audio: prefs.microphoneEnabled ? (prefs.microphoneId !== 'default' ? { deviceId: prefs.microphoneId } : true) : false,
        video: prefs.cameraEnabled ? (prefs.cameraId !== 'default' ? { deviceId: prefs.cameraId } : true) : false
    };
};
