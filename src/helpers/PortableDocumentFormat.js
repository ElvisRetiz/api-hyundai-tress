class PortableDocumentFormat {
  constructor(payrollInfo, payrollDetail) {
    this.payrollInfo = payrollInfo,
    this.plus = payrollDetail.filter(movement => movement.type === "plus");
    this.minus = payrollDetail.filter(movement => movement.type === "minus");
  }

  matchMovements(){
    
    this.limitOfMovements = this.plus.length >= this.minus.length ? this.plus.length : this.minus.length;

    if (this.plus.length !== this.limitOfMovements) {
      let limitP = (this.limitOfMovements - this.plus.length);
      for (let p = 0; p < limitP; p++) {
        this.plus.push({
            number: "",
            description: "",
            type: "",
            amount: ""
        })
      }
    }

    if (this.minus.length !== this.limitOfMovements) {
      let limitM = this.limitOfMovements - this.minus.length;
      for (let d = 0; d < limitM; d++) {
        this.minus.push({
          number: "",
          description: "",
          type: "",
          amount: ""
        })
      }
    }

  }

  fillRows() {
    
    this.matchMovements();

    let rows = "";

    for (let i = 0; i < this.limitOfMovements; i++) {

      rows += `
      <tr>
        <td class="tg-0lax">${this.plus[i].number} ${this.plus[i].description}</td>
        <td class="tg-0lax">${this.plus[i].amount}</td>
        <td class="tg-0lax">${this.minus[i].number} ${this.minus[i].description}</td>
        <td class="tg-0lax">${this.minus[i].amount}</td>
      </tr>
      `

    }

    this.rowsOfMovements = rows;

  }

  getContent() {

    this.fillRows();

    let content = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;700&display=swap" rel="stylesheet">
      <title>Detalle de nomina</title>
      <style type="text/css">
        body {
          padding: 20px;
        }

        .tg  {
          border-collapse: collapse;
          border-spacing: 0;
        }

        .tg td {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, 
          sans-serif;
          font-size:14px;
          overflow:hidden;
          padding:10px 5px;
          word-break:normal;
        }

        .tg th {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, sans-serif;
          font-size:14px;
          font-weight:normal;
          overflow:hidden;
          padding:10px 5px;
          word-break:normal;
        }

        .tg .tg-c3ow {
          border-color:inherit;
          text-align:center;
          vertical-align:top
        }

        .tg .tg-7btt {
          background-color:black;
          border-color:black;
          color: white;
          font-weight:bold;
          text-align:center;
          vertical-align:top
        }

        .tg-detail  {
          width: 100%; 
          border-collapse:collapse;
          border-spacing:0;
          margin-top:25px;
          margin-bottom:10px;
        }

        .tg-detail td {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, sans-serif;
          font-size:14px;
          overflow:hidden;
          padding:10px 5px;
          word-break:normal;
        }

        .tg-detail th {
          border-color:black;
          border-style:solid;
          border-width:1px;
          font-family:Arial, sans-serif;
          font-size:14px;
          font-weight:normal;
          overflow:hidden;
          padding:10px 5px;
          word-break:normal;
        }

        .tg-detail .tg-1wig {
          background-color:black;
          border-color:black;
          color: white;
          font-weight:bold;
          text-align:left;
          vertical-align:top
        }

        .tg-detail .tg-0lax {
          border:none;
          text-align:left;
          vertical-align:top
        }

        .tg-total  {
          width: 100%; 
          border-collapse:collapse;
          border-spacing:0;
        }
        .tg-total td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
          overflow:hidden;padding:10px 5px;word-break:normal;}
        .tg-total th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
          font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
        .tg-total .tg-baqh{text-align:center;vertical-align:top}
        .tg-total .tg-lqy6{text-align:right;vertical-align:top}
        .tg-total .tg-0lax{text-align:right;vertical-align:top}

        .bold {
          font-weight:bold;
        }

        .cabezera {
          background-color:black;
          border-color:black;
          color: white;
        }

        h1,h4 {
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div id="pageHeader" style="padding-bottom: 5px;">
        <h1>${this.payrollInfo.companyName}</h1>
        <h4>${this.payrollInfo.companyAddress}</h4>
        <h4>R.F.C. &nbsp ${this.payrollInfo.companyRfc} &nbsp; &nbsp; &nbsp; REGISTRO PATRONAL &nbsp; ${this.payrollInfo.numReg}</h4>
      </div>
      <table class="tg">
        <tbody>
          <tr>
            <td class="tg-7btt">NUMERO</td>
            <td class="tg-7btt" colspan="3">NOMBRE</td>
            <td class="tg-7btt">R.F.C.</td>
            <td class="tg-7btt">I.M.S.S.</td>
          </tr>
          <tr>
            <td class="tg-c3ow">${this.payrollInfo.employeeNumber}</td>
            <td class="tg-c3ow" colspan="3">${this.payrollInfo.employeeName}</td>
            <td class="tg-c3ow">${this.payrollInfo.rfc}</td>
            <td class="tg-c3ow">${this.payrollInfo.nss}</td>
          </tr>
          <tr>
            <td class="tg-7btt">PERIODO</td>
            <td class="tg-7btt">NOMINA</td>
            <td class="tg-7btt">FECHA DE PAGO</td>
            <td class="tg-7btt">S. DIARIO</td>
            <td class="tg-7btt">S.D. INTEGRADO</td>
            <td class="tg-7btt">C.U.R.P.</td>
          </tr>
          <tr>
            <td class="tg-c3ow">${this.payrollInfo.initialDate} al ${this.payrollInfo.finalDate}</td>
            <td class="tg-c3ow">${this.payrollInfo.periodNumber}</td>
            <td class="tg-c3ow">${this.payrollInfo.payDate}</td>
            <td class="tg-c3ow">${this.payrollInfo.dailySalary}</td>
            <td class="tg-c3ow">${this.payrollInfo.integratedSalary}</td>
            <td class="tg-c3ow">${this.payrollInfo.curp}</td>
          </tr>
          <tr>
            <td class="tg-7btt">FECHA DE INGRESO</td>
            <td class="tg-7btt" colspan="3">FECHA DE ANTIG</td>
            <td class="tg-7btt">CENTRO DE COSTOS</td>
            <td class="tg-7btt">No. CREDITO INFONAVIT</td>
          </tr>
          <tr>
            <td class="tg-c3ow">${this.payrollInfo.admissionDate}</td>
            <td class="tg-c3ow" colspan="3">${this.payrollInfo.seniorityDate}</td>
            <td class="tg-c3ow">${this.payrollInfo.costCenter}</td>
            <td class="tg-c3ow">${this.payrollInfo.creditNumber}</td>
          </tr>
        </tbody>
      </table>
      <table class="tg-detail">
        <tbody>
          <tr>
            <td class="tg-1wig" colspan="2">PERCEPCIONES</td>
            <td class="tg-1wig" colspan="2">DEDUCCIONES</td>
          </tr>
          ${this.rowsOfMovements}
        </tbody>
      </table>
      <table class="tg-total">
        <tbody>
          <tr>
            <td class="tg-0lax bold cabezera">TOTAL DE PERCEPCIONES</td>
            <td class="tg-0lax">${this.payrollInfo.perceptions}</td>
            <td class="tg-0lax bold cabezera">TOTAL DE DEDUCCIONES</td>
            <td class="tg-0lax">${this.payrollInfo.deductions}</td>
          </tr>
          <tr>
            <td class="tg-baqh" colspan="2">${this.payrollInfo.totalInText}</td>
            <td class="tg-lqy6 bold">TOTAL NETO</td>
            <td class="tg-0lax">${this.payrollInfo.total}</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
    `
    return content

  }
  
}

module.exports = PortableDocumentFormat;