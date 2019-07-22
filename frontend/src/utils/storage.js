export function getFromStorage(key) {
  if (!key) return null;
  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function setInStorage(key, obj) {
  if (!key) {
    console.error("setInStorage(key, obj) -> key is missing");
  }

  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.error(err);
  }
}

export function removeFromStorage(key) {
  if (!key) {
    console.error("removeFromStorage(key) -> key is missing");
  }

  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(err);
  }
}

export const token_key = "leToken";
export const notes_key = "guestNotes";
