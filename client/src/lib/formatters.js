export const formatMemberSince = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDisplayDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDisplayTime = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const formatTimeRange = (startTime, endTime) => {
  if (!startTime) {
    return '';
  }

  const start = formatDisplayTime(startTime);
  const end = endTime ? formatDisplayTime(endTime) : '';

  return end ? `${start} - ${end}` : start;
};

export const formatDuration = (startTime, endTime) => {
  if (!startTime || !endTime) {
    return '';
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return '';
  }

  const diffMs = end.getTime() - start.getTime();
  const totalHours = diffMs / (1000 * 60 * 60);

  if (totalHours <= 0) {
    return '';
  }

  const roundedHours = Number.isInteger(totalHours) ? totalHours : totalHours.toFixed(1);
  return `${roundedHours} hrs`;
};

export const titleToInitials = (value = '') => {
  const words = value
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return 'VH';
  }

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
};
