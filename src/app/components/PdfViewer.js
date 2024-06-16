import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";

const PdfViewer = ({ fileUrl }) => {
  const [visible, setVisible] = useState(false);
  const [isPdf, setIsPdf] = useState(false);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const getFileExtension = (url) => {
    return url.split(".").pop().toLowerCase();
  };

  useEffect(() => {
    const fileExtension = getFileExtension(fileUrl);
    if (fileExtension === "pdf") {
      setIsPdf(true);
    } else {
      setIsPdf(false);
    }
  }, [fileUrl]);

  return (
    <>
      {/* //VISUALIZADOR DE IMAGENES O PDFS */}
      <Button type="primary" onClick={handleOpenModal}>
        {isPdf ? "Ver PDF" : "Ver Imagen"}
      </Button>
      <Modal
        title={isPdf ? "Preview PDF" : "Preview Imagen"}
        visible={visible}
        onCancel={handleCloseModal}
        footer={null}
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {isPdf ? (
          <embed src={fileUrl} type="application/pdf" width="100%" height="600px" />
        ) : (
          <img src={fileUrl} alt="Archivo" style={{ width: "auto", height: "500px" }} />
        )}
      </Modal>
    </>
  );
};

export default PdfViewer;
