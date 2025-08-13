import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId: string, filename: string = 'z10-dashboard-report') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create an off-screen container to render the element for the canvas
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);
    
    // Clone the element and append it to the temporary container
    const clonedElement = element.cloneNode(true) as HTMLElement;
    tempContainer.appendChild(clonedElement);

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      height: clonedElement.scrollHeight,
      width: clonedElement.scrollWidth
    });

    // Clean up the temporary element
    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.setProperties({
      title: 'Z10 Dashboard Report',
      subject: 'Development Progress & Bug Tracking Report',
      author: 'Z10 Dashboard System',
      creator: 'Z10 Dashboard',
      keywords: 'dashboard, bugs, development, progress'
    });

    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`${filename}-${timestamp}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};