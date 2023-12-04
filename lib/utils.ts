
export const hasEmptyFields = (values: Record<string, any>): boolean => {
  const checkForEmpty = (val: any): boolean => {
    if (val === '' || val === undefined) {
      return true;
    } else if (typeof val === 'object' && val !== null) {
      if (Array.isArray(val)) {
        return val.some((item) => checkForEmpty(item));
      } else {
        return Object.values(val).some((nestedVal) => checkForEmpty(nestedVal));
      }
    }
    return false;
  };

  return checkForEmpty(values);
};

export const hasBlankWords = (input: string): boolean => {
  const regex = /<[^<>]+>/g; //  match "<word>"
  return regex.test(input);
}

export const formatTimeDelta = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secs = Math.floor(seconds - hours * 3600 - minutes * 60);
  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0) {
    parts.push(`${secs}s`);
  }
  return parts.join(" ");
}

export const extractWords = (text: string) => {
  const regex = /<([^>]*)>/g;
  const matches = text.match(regex);

  if (!matches) {
    return [];
  }

  // Extract words from matches by removing the < and > characters
  const words = matches.map((match) => match.slice(1, -1));

  return words;
};
