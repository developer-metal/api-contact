const levelActions = (level: number) => {
    const contentLevel: Array<string> = ['Muy Facil', 'Facil', 'Indiferente', 'Dificil', 'Muy Dificil'];
    return contentLevel[level - 1] || 'Nivel no válido';
}
const nivelValores: { [key: string]: number } = {
    'MUY FACIL': 1,
    'FACIL': 2,
    'INDIFERENTE': 3,
    'DIFICIL': 4,
    'MUY DIFICIL': 5
  };
export { levelActions, nivelValores };