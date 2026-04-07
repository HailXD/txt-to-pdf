const FILE_EXT = ".pdf"
const STATUS_READY = "Ready"
const STATUS_EMPTY = "Enter text to export"
const STATUS_DONE = "PDF downloaded"

const textInput = document.querySelector("#textInput")
const status = document.querySelector("#status")
const downloadBtn = document.querySelector("#downloadBtn")
const clearBtn = document.querySelector("#clearBtn")

function getFileName() {
  const x = parseInt(Date.now() / 10).toString(26).replace(/./g, c => (parseInt(c, 26) + 10).toString(36))
  return `${x}${FILE_EXT}`
}

function downloadPdf() {
  const text = textInput.value.trim()

  if (!text) {
    status.textContent = STATUS_EMPTY
    return
  }

  const jspdfApi = window.jspdf

  if (!jspdfApi?.jsPDF) {
    status.textContent = "PDF engine failed to load"
    return
  }

  const doc = new jspdfApi.jsPDF({
    unit: "pt",
    format: "a4"
  })
  const margin = 56
  const pageWidth = doc.internal.pageSize.getWidth() - margin * 2
  const pageHeight = doc.internal.pageSize.getHeight()
  const lines = doc.splitTextToSize(text, pageWidth)
  const lineHeight = 18
  let y = margin

  doc.setFont("times", "normal")
  doc.setFontSize(12)

  lines.forEach((line, index) => {
    const nextY = y + lineHeight

    if (nextY > pageHeight - margin) {
      doc.addPage()
      y = margin
    }

    doc.text(line, margin, y)
    y += lineHeight

    if (index === lines.length - 1 && line === "") {
      y += lineHeight
    }
  })

  doc.save(getFileName())
  status.textContent = STATUS_DONE
}

function clearAll() {
  textInput.value = ""
  status.textContent = STATUS_READY
  textInput.focus()
}

downloadBtn.addEventListener("click", downloadPdf)
clearBtn.addEventListener("click", clearAll)
