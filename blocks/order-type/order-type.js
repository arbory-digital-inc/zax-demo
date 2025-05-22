export default function decorate(block) {
  // Get the first row which contains the title
  const titleRow = block.children[0];
  if (titleRow) {
    titleRow.classList.add('order-title');
    const titleEl = titleRow.querySelector('p');
    if (titleEl) {
      titleEl.classList.add('title-text');
    }
  }
  
  // Get the second row which contains the buttons
  const buttonsRow = block.children[1];
  if (buttonsRow) {
    buttonsRow.classList.add('order-buttons');
    
    // Style each button
    const buttons = buttonsRow.querySelectorAll('div');
    buttons.forEach(buttonCell => {
      buttonCell.classList.add('button-cell');
      
      // Style the link
      const link = buttonCell.querySelector('a');
      if (link) {
        // Add general order button class
        link.classList.add('order-button');
        
        // Remove any existing button class to prevent style conflicts
        link.classList.remove('button');
        
        // Add specific class based on text content
        const linkText = link.textContent.trim().toLowerCase();
        if (linkText === 'pickup') {
          link.classList.add('order-pickup');
          buttonCell.classList.add('pickup-cell');
        } else if (linkText === 'delivery') {
          link.classList.add('order-delivery');
          buttonCell.classList.add('delivery-cell');
        }
      }
    });
  }
}
