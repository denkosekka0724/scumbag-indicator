#!/usr/bin/env node
const assert = require("node:assert/strict");
const detector = require("../src/detector");
const cases = require("../eval/seed-cases");

const CATEGORY_NAMES = detector.CATEGORIES.map((item) => item.name);

function assertKnownCategories(caseItem) {
  const allCategories = [...(caseItem.expected_categories || []), ...(caseItem.forbidden_categories || [])];
  allCategories
    .filter((category) => category !== "安全风险")
    .forEach((category) => {
      assert.ok(CATEGORY_NAMES.includes(category), `${caseItem.id}: unknown category ${category}`);
    });
}

function hitCategories(result) {
  return result.category_scores.filter((item) => item.hit).map((item) => item.category);
}

function evaluateCase(caseItem) {
  assertKnownCategories(caseItem);
  const result = detector.analyze(caseItem.input, caseItem.options || {});
  const hits = hitCategories(result);
  const [minScore, maxScore] = caseItem.expected_score_range;

  assert.ok(result.score >= minScore, `${caseItem.id}: score ${result.score} < ${minScore}`);
  assert.ok(result.score <= maxScore, `${caseItem.id}: score ${result.score} > ${maxScore}`);
  assert.equal(result.safety_override, caseItem.safety_override, `${caseItem.id}: safety_override mismatch`);

  (caseItem.expected_categories || []).forEach((category) => {
    assert.ok(hits.includes(category), `${caseItem.id}: expected ${category}, got ${hits.join(", ") || "none"}`);
    const categoryResult = result.category_scores.find((item) => item.category === category);
    assert.ok(categoryResult.evidence.length > 0, `${caseItem.id}: expected evidence for ${category}`);
  });

  (caseItem.forbidden_categories || []).forEach((category) => {
    if (category === "安全风险") {
      assert.equal(result.safety_override, false, `${caseItem.id}: forbidden safety override triggered`);
      return;
    }
    assert.equal(hits.includes(category), false, `${caseItem.id}: forbidden ${category} was hit`);
  });

  if ((caseItem.expected_categories || []).length) {
    assert.ok(result.strongest_evidence.length > 0, `${caseItem.id}: missing strongest evidence`);
  }

  return {
    id: caseItem.id,
    type: caseItem.type,
    focus: caseItem.focus,
    score: result.score,
    risk_level: result.risk_level,
    safety_override: result.safety_override,
    hits
  };
}

function summarize(results) {
  const byType = {};
  const byCategory = {};
  results.forEach((result) => {
    byType[result.type] = (byType[result.type] || 0) + 1;
    result.hits.forEach((category) => {
      byCategory[category] = (byCategory[category] || 0) + 1;
    });
  });
  return {
    total: results.length,
    byType,
    byCategory,
    maxScore: Math.max(...results.map((item) => item.score)),
    minScore: Math.min(...results.map((item) => item.score))
  };
}

function runEvaluation() {
  assert.equal(cases.length, 40, `expected 40 seed cases, got ${cases.length}`);
  const ids = new Set();
  cases.forEach((caseItem) => {
    assert.ok(caseItem.id, "case id is required");
    assert.equal(ids.has(caseItem.id), false, `duplicate case id ${caseItem.id}`);
    ids.add(caseItem.id);
    assert.ok(caseItem.input && caseItem.input.length >= 8, `${caseItem.id}: input too short`);
    assert.ok(Array.isArray(caseItem.expected_score_range), `${caseItem.id}: score range required`);
    assert.ok(caseItem.annotation?.why, `${caseItem.id}: annotation why required`);
  });

  const results = cases.map(evaluateCase);
  const summary = summarize(results);
  assert.equal(summary.byType.synthetic, 24);
  assert.equal(summary.byType.counterexample, 8);
  assert.equal(summary.byType.safety, 4);
  assert.equal(summary.byType.mixed, 4);
  CATEGORY_NAMES.forEach((category) => {
    assert.ok(summary.byCategory[category] > 0, `category ${category} is not covered`);
  });
  return { results, summary };
}

if (require.main === module) {
  const { summary } = runEvaluation();
  console.log(`eval cases passed: ${summary.total}`);
  console.log(`by type: ${JSON.stringify(summary.byType)}`);
  console.log(`by category: ${JSON.stringify(summary.byCategory)}`);
}

module.exports = {
  evaluateCase,
  runEvaluation
};
