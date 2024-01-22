
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
  if(seconds === 0){
    return '0s'
  }
  
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


export const sanitizeAnswer = (text: string) => {
  return text.replace(/<|>/g, '').trim()
}


export const calculateAverageAccuracy = (answers: any[]) => {
  let averageAccuracy = 0;

  if (answers.length > 0) {
    const firstAnswer = answers[0]

    if ('percentage_correct' in firstAnswer) {

      const percentages: number[] = answers.map(answer => answer.percentage_correct)
      const totalPercentage = percentages.reduce((acc, val) => acc + val, 0)

      averageAccuracy = Math.round(totalPercentage / percentages.length)

    } else if ('is_correct' in firstAnswer) {

      let correctAnswers = 0;
      let wrongAnswers = 0;

      answers.forEach(answer => {
        if (answer.is_correct) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
      });

      let total = correctAnswers + wrongAnswers;

      averageAccuracy = Math.round((correctAnswers / total) * 100)

    }
  }
  
  return averageAccuracy
};