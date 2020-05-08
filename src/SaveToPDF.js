import React, { Component } from "react";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFExport from "./PDFExport";

class SaveToPDF extends Component {
  render() {
    return (
      <div className="saveToPDF">
        {this.props.isReady ? (
          <PDFDownloadLink
            className={this.props.pdfClass}
            document={
              <PDFExport title={this.props.title} text={this.props.text} />
            }
            fileName={`${this.props.title}.pdf`}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download now!"
            }
          </PDFDownloadLink>
        ) : null}

        {this.props.displayForm ? (
          <button
            type="button"
            onClick={this.props.savePDF}
            aria-label="Save To PDF"
          >
            <i className="far fa-file-pdf" aria-hidden="true"></i>
          </button>
        ) : null}
      </div>
    );
  }
}

export default SaveToPDF;
