import DatePicker from 'react-datepicker';
const StartDate = ({startDate,hadleStartDate, endDate, es}:{startDate: any,hadleStartDate: any, endDate: any, es: any}) => {
    return (<DatePicker
    selected={startDate}
    onChange={ (date: any) => hadleStartDate(date)}
    id="startDate"
    selectsStart
    startDate={startDate}
    endDate={endDate}
    placeholderText="Fecha Desde"
    dateFormat={"dd/MM/yyyy"}
    showIcon={true}
    className={`form-control`}
    locale={es}
    withPortal={true}
    isClearable={true}
  />)
}
const EndDate = ({endDate, hadledEndDate, startDate, es}:{endDate: any, hadledEndDate: any, startDate: any, es: any}) => {
    return ( <DatePicker
    id="endDate"
    selected={endDate}
    onChange={(date: any) => hadledEndDate(date)}
    selectsEnd
    startDate={startDate}
    endDate={endDate}
    minDate={startDate}
    placeholderText="Fecha Hasta"
    dateFormat={"dd/MM/yyyy"}
    showIcon={true}
    className={`form-control`}
    locale={es}
    withPortal={true}
    isClearable={true}
  />
)}
export {
    StartDate,
    EndDate
}