// Define the dialog box
new Dialog({
  title: "Adjust Token Elevation",
  content: `
    <form>
      <div class="form-group">
        <label for="elevation">Elevation Change:</label>
        <input type="number" id="elevation" name="elevation" value="10" step="1">
      </div>
    </form>
  `,
  buttons: {
    increase: {
      icon: '<i class="fas fa-arrow-up"></i>',
      label: "Increase",
      callback: (html) => {
        let elevationChange = parseFloat(html.find('[name="elevation"]').val());
        adjustTokenElevation(elevationChange);
      }
    },
    decrease: {
      icon: '<i class="fas fa-arrow-down"></i>',
      label: "Decrease",
      callback: (html) => {
        let elevationChange = -parseFloat(html.find('[name="elevation"]').val());
        adjustTokenElevation(elevationChange);
      }
    }
  },
  default: "increase"
}).render(true);

// Function to adjust the elevation of selected tokens
function adjustTokenElevation(change) {
  // Get all selected tokens
  let selectedTokens = canvas.tokens.controlled;

  // Check if there are selected tokens
  if (selectedTokens.length === 0) {
    ui.notifications.warn("No tokens selected!");
    return;
  }

  // Adjust elevation for each selected token
  selectedTokens.forEach(token => {
    let currentElevation = token.document.elevation || 0;
    let newElevation = currentElevation + change;
    
    // Update token elevation
    token.document.update({ elevation: newElevation });
  });
}
