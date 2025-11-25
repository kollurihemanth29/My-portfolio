// Vercel-compatible logger (console-based, no file system)
// File system operations are not supported in Vercel serverless functions

class Logger {
  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaString}`;
  }

  info(message, meta = {}) {
    const logMessage = this.formatMessage('info', message, meta);
    console.log(`ℹ️  ${logMessage}`);
  }

  warn(message, meta = {}) {
    const logMessage = this.formatMessage('warn', message, meta);
    console.warn(`⚠️  ${logMessage}`);
  }

  error(message, meta = {}) {
    const logMessage = this.formatMessage('error', message, meta);
    console.error(`❌ ${logMessage}`);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('debug', message, meta);
      console.log(`🐛 ${logMessage}`);
    }
  }

  http(message, meta = {}) {
    const logMessage = this.formatMessage('http', message, meta);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 ${logMessage}`);
    }
  }
}

const logger = new Logger();
module.exports = logger;