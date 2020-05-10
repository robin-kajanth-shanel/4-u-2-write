import React, { Component } from "react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFExport from "./PDFExport";

const SaveToPDF = (props) => {
  return (
    <div className="saveToPDF">
      {props.isReady ? (
        <PDFDownloadLink
          className={props.pdfClass}
          document={<PDFExport title="title" message={props.text} />}
          fileName={`title.pdf`}
        >
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : "Download now!"
          }
        </PDFDownloadLink>
      ) : null}

      {props.displayForm ? (
        <button type="button" onClick={props.savePDF} aria-label="Save To PDF">
          <i className="far fa-file-pdf" aria-hidden="true"></i>
        </button>
      ) : null}
    </div>
  );
};

export default SaveToPDF;
