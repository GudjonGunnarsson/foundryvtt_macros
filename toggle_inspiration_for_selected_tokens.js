// Define the effect UUID for "Inspo"
const effectUuid = "Item.x95LIccrQE65m6n9.ActiveEffect.KbRwx6SV8oWEcutf";

// Get the list of selected tokens
const selectedTokens = canvas.tokens.controlled;

if (selectedTokens.length === 0) {
  ui.notifications.warn("No tokens selected!");
  return;
}

// Function to toggle or add the effect by UUID
async function toggleOrAddEffectForActor(actor, effectUuid) {
  const effectData = await fromUuid(effectUuid); // Fetch the effect data from the UUID
  if (!effectData) {
    ui.notifications.error("Effect not found!");
    return;
  }

  // Find the effect on the actor
  const existingEffect = actor.effects.find(e => e.origin === effectUuid);

  if (existingEffect) {
    // If the effect exists, toggle its disabled state
    await existingEffect.update({ disabled: !existingEffect.disabled });
    ui.notifications.info(`Toggled "${effectData.name}" for ${actor.name}`);
  } else {
    // If the effect doesn't exist, create it
    const effectToAdd = duplicate(effectData.toObject());
    effectToAdd.origin = effectUuid; // Set the origin to match the UUID
    effectToAdd.disabled = false; // Ensure the effect is active when added
    await actor.createEmbeddedDocuments("ActiveEffect", [effectToAdd]);
    ui.notifications.info(`Added "${effectData.name}" to ${actor.name}`);
  }
}

// Apply the effect to all selected tokens
selectedTokens.forEach(token => {
  toggleOrAddEffectForActor(token.actor, effectUuid);
});
