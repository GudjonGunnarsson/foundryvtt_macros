// Prompt the user to enter a damage/heal number and select the action type
new Dialog({
  title: "Apply Damage or Heal",
  content: `
    <p>Select an action to apply to the selected tokens:</p>
    <div style="margin-bottom: 10px;">
      <label style="margin-right: 10px;">
        <input type="radio" name="actionType" value="damage" checked /> Damage
      </label>
      <label>
        <input type="radio" name="actionType" value="heal" /> Heal
      </label>
    </div>
    <div>
      <label for="valueAmount">Enter value:</label>
      <input type="number" id="valueAmount" style="width: 100px;" placeholder="Enter value" />
    </div>
  `,
  buttons: {
    apply: {
      icon: "<i class='fas fa-check'></i>",
      label: "Apply",
      callback: (html) => {
        const actionType = html.find("input[name='actionType']:checked").val();
        const value = parseInt(html.find("#valueAmount").val());

        if (isNaN(value) || value <= 0) {
          ui.notifications.warn("Please enter a valid number.");
          return;
        }

        applyDamageOrHealToSelectedTokens(value, actionType);
      }
    },
    cancel: {
      icon: "<i class='fas fa-times'></i>",
      label: "Cancel"
    }
  },
  default: "apply"
}).render(true);

// Function to apply damage or heal to all selected tokens
function applyDamageOrHealToSelectedTokens(value, actionType) {
  // Get all selected tokens
  const selectedTokens = canvas.tokens.controlled;

  if (selectedTokens.length === 0) {
    ui.notifications.warn("No tokens selected!");
    return;
  }

  // Loop through each selected token
  selectedTokens.forEach(token => {
    const actor = token.actor;
    if (!actor) return;

    // Get the actor's current HP and max HP
    const currentHP = actor.system.attributes.hp.value;
    const maxHP = actor.system.attributes.hp.max;

    let newHP;
    if (actionType === "damage") {
      // Calculate new HP after damage
      newHP = Math.max(currentHP - value, 0); // Ensure HP doesn't go below 0
      ui.notifications.info(`${actor.name} takes ${value} damage and now has ${newHP} HP.`);
    } else if (actionType === "heal") {
      // Calculate new HP after healing
      newHP = Math.min(currentHP + value, maxHP); // Ensure HP doesn't exceed max HP
      ui.notifications.info(`${actor.name} is healed by ${value} and now has ${newHP} HP.`);
    }

    // Apply the new HP by updating the actor's data
    actor.update({ "system.attributes.hp.value": newHP });
  });
}
