function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function rsvpSheet() {
  return (
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVPs") ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVPs")
  );
}

function giftSheet() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Gifts") ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("Gifts");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["id", "price", "draft", "claimed", "claimedBy", "claimedAt"]);
  }
  return sheet;
}

function readGifts() {
  const sheet = giftSheet();
  const values = sheet.getDataRange().getValues();
  const gifts = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue;
    gifts.push({
      id: String(row[0]),
      price: row[1] === "" || row[1] == null ? null : Number(row[1]),
      draft: row[2] === true || row[2] === "TRUE" || row[2] === "true",
      claimed: row[3] === true || row[3] === "TRUE" || row[3] === "true",
      claimedBy: row[4] || null,
      claimedAt: row[5] ? String(row[5]) : null,
    });
  }
  return gifts;
}

function upsertGift(data) {
  const sheet = giftSheet();
  const values = sheet.getDataRange().getValues();
  var rowIndex = -1;
  for (var i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.id)) {
      rowIndex = i + 1;
      break;
    }
  }
  const row = [
    data.id,
    data.price == null || data.price === "" ? "" : data.price,
    data.draft === true,
    data.claimed === true,
    data.claimedBy || "",
    data.claimedAt || "",
  ];
  if (rowIndex === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowIndex, 1, 1, 6).setValues([row]);
  }
}

function saveRsvp(data) {
  const sheet = rsvpSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Attending",
      "Guests",
      "Message",
    ]);
  }
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.email || "",
    data.attending ? "Yes" : "No",
    data.guests ?? "",
    data.message || "",
  ]);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.type === "gift-list") {
      return json({ ok: true, gifts: readGifts() });
    }
    if (data.type === "gift-update") {
      upsertGift(data);
      return json({ ok: true });
    }
    saveRsvp(data);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}
