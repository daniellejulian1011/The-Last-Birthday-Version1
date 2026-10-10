import { NODES, EVIDENCE, ENDINGS, ITEMS } from './story.js';

export const VERSION = 1;
const limit = (v, min, max) => Math.min(max, Math.max(min, v));
const clone = value => JSON.parse(JSON.stringify(value));

export function newState() {
  return {
    version: VERSION, node: 'arrival', minutes: 0, battery: 100,
    nerve: 12, noise: 0, trust: 0, flags: {}, items: [], evidence: [],
    visited: [], history: [], ending: null, flashlight: true, puzzleAttempts: {}
  };
}

export function permitted(state, rule) {
  if (!rule) return true;
  if (rule.flags && !rule.flags.every(id => !!state.flags[id])) return false;
  if (rule.notFlags && rule.notFlags.some(id => !!state.flags[id])) return false;
  if (rule.items && !rule.items.every(id => state.items.includes(id))) return false;
  if (rule.evidence && !rule.evidence.every(id => state.evidence.includes(id))) return false;
  if (rule.evidenceCount != null && state.evidence.length < rule.evidenceCount) return false;
  if (rule.trust != null && state.trust < rule.trust) return false;
  if (rule.any && !rule.any.some(r => permitted(state, r))) return false;
  return true;
}

function effects(state, effect = {}) {
  for (const key of ['minutes', 'battery', 'nerve', 'noise', 'trust']) {
    if (effect[key] != null) state[key] += effect[key];
  }
  state.minutes = limit(state.minutes, 0, 200);
  state.battery = limit(state.battery, 0, 100);
  state.nerve = limit(state.nerve, 0, 100);
  state.noise = limit(state.noise, 0, 100);
  state.trust = limit(state.trust, -5, 5);
  Object.assign(state.flags, effect.flags || {});
  for (const key of ['items', 'evidence']) {
    for (const item of effect[key] || []) if (!state[key].includes(item)) state[key].push(item);
  }
  if (effect.removeItems) state.items = state.items.filter(id => !effect.removeItems.includes(id));
  if (effect.removeEvidence) state.evidence = state.evidence.filter(id => !effect.removeEvidence.includes(id));
}

export function enterNode(previous, id) {
  if (!NODES[id]) throw new Error(`Unknown story node: ${id}`);
  const state = clone(previous);
  state.node = id;
  const first = !state.visited.includes(id);
  if (first) {
    state.visited.push(id);
    effects(state, NODES[id].enter);
  }
  if (NODES[id].ending) state.ending = NODES[id].ending;
  const entry = { node: id, minute: state.minutes };
  state.history.push(entry);
  state.history = state.history.slice(-150);
  return { state, node: NODES[id], first, event: first ? NODES[id].scare || null : null };
}

export function startGame() { return enterNode(newState(), 'arrival'); }

export function choose(previous, choiceId) {
  const node = NODES[previous.node];
  const choice = node.choices?.find(c => c.id === choiceId);
  if (!choice) throw new Error(`Invalid choice ${choiceId} at ${previous.node}`);
  if (!permitted(previous, choice.requires)) throw new Error('That route is locked.');
  if (previous.ending) throw new Error('This story has ended.');
  const state = clone(previous);
  effects(state, choice.effects);
  return enterNode(state, choice.to);
}

export function solvePuzzle(previous, attempt) {
  const puzzle = NODES[previous.node].puzzle;
  if (!puzzle) throw new Error('No puzzle is active.');
  const state = clone(previous);
  const answer = String(attempt).replace(/\s+/g, '');
  state.puzzleAttempts[previous.node] = (state.puzzleAttempts[previous.node] || 0) + 1;
  if (answer !== puzzle.code) {
    effects(state, { nerve: 3, noise: 2 });
    return { state, node: NODES[state.node], first: false, event: 'error', solved: false };
  }
  effects(state, puzzle.effects);
  return { ...enterNode(state, puzzle.to), solved: true };
}

export function clock(state) {
  const mins = 20 * 60 + 12 + state.minutes;
  const hours = Math.floor(mins / 60) % 24;
  return `${String(hours % 12 || 12).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
}

export function validateState(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== VERSION || !NODES[raw.node]) return null;
  const fresh = newState();
  for (const k of ['minutes', 'battery', 'nerve', 'noise', 'trust']) {
    if (!Number.isFinite(raw[k])) return null;
    fresh[k] = limit(raw[k], k === 'trust' ? -5 : 0, k === 'minutes' ? 200 : k === 'trust' ? 5 : 100);
  }
  for (const k of ['items', 'evidence', 'visited']) {
    if (!Array.isArray(raw[k]) || raw[k].some(x => typeof x !== 'string')) return null;
    fresh[k] = [...new Set(raw[k])].slice(0, 200);
  }
  if (fresh.visited.some(x => !NODES[x]) || fresh.evidence.some(x => !EVIDENCE[x]) || fresh.items.some(x => !ITEMS[x])) return null;
  if (!raw.flags || typeof raw.flags !== 'object' || Array.isArray(raw.flags)) return null;
  fresh.flags = Object.fromEntries(Object.entries(raw.flags).filter(([k,v]) => /^[a-zA-Z][a-zA-Z0-9_]*$/.test(k) && typeof v === 'boolean'));
  fresh.node = raw.node;
  fresh.ending = NODES[raw.node].ending || null;
  if (raw.ending && !ENDINGS[raw.ending]) return null;
  fresh.flashlight = raw.flashlight !== false;
  fresh.history = Array.isArray(raw.history) ? raw.history.filter(h => h && NODES[h.node] && Number.isFinite(h.minute)).slice(-150) : [];
  fresh.puzzleAttempts = Object.fromEntries(Object.entries(raw.puzzleAttempts || {}).filter(([k,v]) => NODES[k]?.puzzle && Number.isInteger(v) && v >= 0).map(([k,v]) => [k, Math.min(10000,v)]));
  return fresh;
}
