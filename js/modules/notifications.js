export class NotificationManager {
  constructor() {
    this.container = document.getElementById('notifications');
  }

  show(message, type = 'info', duration = 3000) {
    const notification = this.createNotification(message, type);
    this.container.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show-notification');
    }, 10);

    // Auto-remover após duração especificada
    setTimeout(() => {
      this.remove(notification);
    }, duration);
  }

  createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getIcon(type)}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    return notification;
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.classList.add('hide-notification');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }

   getIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message, duration = 5000) {
    this.show(message, 'error', duration);
  }

  warning(message, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }
}