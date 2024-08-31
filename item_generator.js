// Utility function to generate the item description as HTML
function generateItemDescription(history, creator, trait, quirk) {
  return `
    <ul>
      <li><strong>History</strong><br> ${history}</li><br>
      <li><strong>Creator / Intended Use</strong><br> ${creator}</li><br>
      <li><strong>Minor Magical Trait</strong><br> ${trait}</li><br>
      <li><strong>Quirk</strong><br> ${quirk}</li>
    </ul>
  `;
}

// Utility function to handle drawing from a table and getting the result text
async function drawFromTable(tableUuid) {
  try {
    const table = await fromUuid(tableUuid);
    const result = await table.draw({ displayChat: false });
    if (result.results.length > 0) {
      return result.results[0].text;
    } else {
      console.warn(`No results found for table with UUID: ${tableUuid}`);
      return "Unknown";
    }
  } catch (error) {
    console.error(`Error drawing from table ${tableUuid}:`, error);
    return "Error";
  }
}

// List of table UUIDs
const tableUuids = {
  history: "Compendium.sarco-compendiums.sarco-tables.RollTable.kyUrf0rLSXK91MHM",
  creator: "Compendium.sarco-compendiums.sarco-tables.RollTable.Zsd2MwPVdQKHEJVs",
  trait: "Compendium.sarco-compendiums.sarco-tables.RollTable.BRIwvYszaB6sJgB7",
  quirk: "Compendium.sarco-compendiums.sarco-tables.RollTable.mC3n5i7TEHUY1nGN",
};

// Fetch and draw from all tables in parallel
const [historyResult, creatorResult, traitResult, quirkResult] = await Promise.all([
  drawFromTable(tableUuids.history),
  drawFromTable(tableUuids.creator),
  drawFromTable(tableUuids.trait),
  drawFromTable(tableUuids.quirk),
]);


const itemDescription = generateItemDescription(historyResult, creatorResult, traitResult, quirkResult);

// Get GM users to send a whisper to
const gmUsers = game.users.filter(user => user.isGM).map(user => user.id);

// Create a secret chat card visible only to the GM
ChatMessage.create({
  user: game.user.id, // Sender of the message
  speaker: ChatMessage.getSpeaker({ alias: "Item Generator" }), // Customize the alias as needed
  content: itemDescription,
  type: CONST.CHAT_MESSAGE_STYLES.OTHER, // Use OTHER type for custom messages
  flavor: "Randomly Generated Item", // Add a title to the chat card if needed
  whisper: gmUsers, // Ensure the message is only whispered to GM users
});
