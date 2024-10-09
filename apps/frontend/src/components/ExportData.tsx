import { Button } from "react-bootstrap"
import downloadCSV from "../utils/helpers/exportCsv"
import React, { useState } from "react";
import ModalCustom from "./ModalsAlert";

function ExportData(data: any): any {
    const [showModal, setShowModal] = useState(false);
    const contentModal: any = {
            title: "Alert!",
            description: '¡No hay datos para exportar!',
            titleButton: [{variant: 'secondary', name: 'Cerrar' }],
            showParam: showModal
        };
    const handleExportClick = () => {
        if (data.export.length === 0) {
            setShowModal(true);
            return;
        }
        downloadCSV(data.export, data.rangeDate);  
    };
    return (
        <>
        {React.useMemo(() => <Button onClick={() => { handleExportClick() }}  >Exportar/Excel</Button>, [data.export])}
        <ModalCustom dataModalAlert={contentModal} onCloseAlert={() => setShowModal(false)} onSaveAlert={() => setShowModal(false)} />
        </>
        );
       
}
export default ExportData;

