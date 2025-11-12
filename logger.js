// logger.js
class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 100; // Keep last 100 logs in memory
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data ? this.sanitizeData(data) : null
    };

    // Add to memory
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Console output
    const consoleMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    switch(level) {
      case 'error':
        console.error(consoleMessage, data);
        break;
      case 'warn':
        console.warn(consoleMessage, data);
        break;
      default:
        console.log(consoleMessage, data);
    }

    // Optional: Save to localStorage for persistence
    this.saveToStorage();
  }

  sanitizeData(data) {
    // Remove sensitive information before logging
    const sanitized = {...data};
    const sensitiveKeys = ['publicKey', 'serviceId', 'templateId', 'email', 'password', 'token'];
    
    sensitiveKeys.forEach(key => {
      if (sanitized[key]) {
        sanitized[key] = '***REDACTED***';
      }
    });

    return sanitized;
  }

  saveToStorage() {
    try {
      localStorage.setItem('emailjs_logs', JSON.stringify(this.logs));
    } catch (e) {
      // localStorage might not be available
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('emailjs_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      // Ignore errors
    }
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('emailjs_logs');
  }
}

// Create global logger instance
window.logger = new Logger();
window.logger.loadFromStorage();