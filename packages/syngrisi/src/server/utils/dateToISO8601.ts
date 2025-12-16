const dateToISO8601 = (date: string | Date): string => {
  return new Date(new Date(date)).toISOString().split('T')[0];
};

export default dateToISO8601;
