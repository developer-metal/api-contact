const searchGeneral = (event: any ,row: any) => {
 const matchingRut = row.rut.find((val: any) => {
    const statementMatches = String(val.statement)?.toUpperCase().includes("RUT COMERCIO");
    const rutMatches = cleanRut(val.response).includes(event.target.value);
    console.log('rut ', cleanRut(val.response));
    return statementMatches && rutMatches;
  });
  return matchingRut;
};
const cleanRut = (rut: any) => {
    return rut.replace(/[-.]/g, '');
  };
export {
    searchGeneral,
    cleanRut
};

