import { EXTENSION_ID } from "./extension";

export async function getField(record, fieldName) {
  return record.getExtensionField(EXTENSION_ID, fieldName);
}

export async function setField(record, fieldName, newValue) {
  return record.setExtensionField(EXTENSION_ID, fieldName, newValue);
}

export async function getUserPreference(fieldName) {
  return getField(aha.user, fieldName);
}

export async function setUserPreference(fieldName, newValue) {
  return setField(aha.user, fieldName, newValue);
}
