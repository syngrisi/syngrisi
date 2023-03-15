/* eslint-disable no-underscore-dangle */

'use strict';

// const mongoose = require('mongoose');

// const Snapshot = mongoose.model('VRSSnapshot');
// const Check = mongoose.model('VRSCheck');
// const Baseline = mongoose.model('VRSBaseline');
// const Test = mongoose.model('VRSTest');
// const Suite = mongoose.model('VRSSuite');
// const moment = require('moment');
// const {
//     fatalError,
//     checkIdent,
//     checksGroupedByIdent,
//     removeEmptyProperties,
// } = require('../utils');

// async function getSnapshotByImgHash(hash) {
//     return (await Snapshot.find({ imghash: hash }))[0];
// }
//
// exports.checksGroupView = async function checksGroupView(req, res) {
//     try {
//         const opts = removeEmptyProperties(req.query);
//
//         if (!opts.id) {
//             res.status(404)
//                 .send('Cannot return checks ident group. There is no check "id" field in request query');
//             return;
//         }
//
//         const check = await Check.findById(`${opts.id}`)
//             .exec();
//
//         const test = await Test.findById(check.test)
//             .exec();
//         const suite = await Suite.findById(check.suite)
//             .exec();
//         const testId = check.test;
//         const ident = checkIdent(check);
//         log.warn(check.name, '|', testId, '|', suite, '|', ident, '|');
//         const groups = await checksGroupedByIdent({ test: testId });
//         const groupChecks = groups[ident].checks;
//         const transGroups = await Promise.all(
//             groupChecks.map(async (chk) => {
//                 const actual = await Snapshot.findById(chk.actualSnapshotId)
//                     .exec();
//                 const baseline = await Snapshot.findById(chk.baselineId)
//                     .exec();
//                 const diff = await Snapshot.findById(chk.diffId)
//                     .exec();
//                 const ch = chk.toObject();
//                 ch.actual = actual ? actual.toObject() : null;
//                 ch.baseline = baseline ? baseline.toObject() : null;
//                 ch.diff = diff ? diff.toObject() : null;
//                 return ch;
//             })
//         );
//         log.info(transGroups);
//         res.render('pages/checkgroup', {
//             checks: transGroups,
//             test,
//             suite,
//         });
//     } catch (e) {
//         fatalError(req, res, e);
//     }
// };
//
// exports.checkView = async function checkView(req, res) {
//     try {
//         const opts = removeEmptyProperties(req.query);
//
//         if (!opts.id) {
//             res.status(400)
//                 .json({ error: 'Cannot return snapshot. There is no "id" field in request query' });
//             return;
//         }
//         const check = await Check.findById(opts.id);
//         const test = await Test.findById(`${check.test}`);
//         const suite = await Suite.findById(`${check.suite}`);
//         let baselineSnapshot;
//         if (check.baselineId) {
//             baselineSnapshot = await Snapshot.findById(`${check.baselineId}`)
//                 .exec();
//             baselineSnapshot.formattedCreatedDate = moment(baselineSnapshot.createdDate)
//                 .format('YYYY-MM-DD hh:mm');
//         }
//
//         let actualSnapshot;
//         if (check.actualSnapshotId) {
//             actualSnapshot = await Snapshot.findById(`${check.actualSnapshotId}`);
//             actualSnapshot.formattedCreatedDate = moment(actualSnapshot.createdDate);
//         } else {
//             actualSnapshot = null;
//         }
//         // const diffId = check.diffId ? check.diffId : '';
//
//         let diffSnapshot;
//         if (check.diffId) {
//             diffSnapshot = await Snapshot.findById(`${check.diffId}`);
//             diffSnapshot.formattedCreatedDate = moment(diffSnapshot.createdDate);
//         }
//
//         const checksWithSameName = await checksGroupedByIdent({ name: check.name });
//         const checksWithSameTestId = Array.from(await Check.find({ test: test._id }));
//
//         const currentCheckIndex = checksWithSameTestId.map((x) => x._id.toString())
//             .indexOf(check._id.toString());
//         const countOfChecksWithSameTestId = checksWithSameTestId.length;
//         const prevCheck = async (modelName, id) => {
//             const model = mongoose.model(modelName);
//             return model.findOne({ test: test._id, _id: { $lt: id } })
//                 .sort({ _id: -1 })
//                 .exec();
//         };
//         const nextCheck = async (modelName, id) => {
//             const model = mongoose.model(modelName);
//             return model.findOne({ test: test._id, _id: { $gt: id } })
//                 .sort({ _id: 1 })
//                 .exec();
//         };
//
//         const prevCheckId = currentCheckIndex !== 0 ? (await prevCheck('VRSCheck', check._id))?._id : null;
//         const nextCheckId = currentCheckIndex + 1 !== checksWithSameTestId.length ? (await nextCheck('VRSCheck', check._id))?._id : null;
//
//         let lastChecksWithSameName = [];
//         for (const group of Object.values(checksWithSameName)) {
//             lastChecksWithSameName.push(group.checks[group.checks.length - 1]);
//         }
//         lastChecksWithSameName = lastChecksWithSameName.sort((a, b) => Number(new Date(b.updatedDate) - Number(new Date(a.updatedDate))));
//         const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id })
//             .exec();
//         res.render('pages/checkview', {
//             baselineSnapshot,
//             actualSnapshot,
//             diffSnapshot,
//             baseline,
//             check,
//             test,
//             suite,
//             lastChecksWithSameName,
//             prevCheckId,
//             nextCheckId,
//             currentCheckIndex,
//             countOfChecksWithSameTestId,
//             user: req.user,
//         });
//     } catch (e) {
//         fatalError(req, res, e);
//     }
// };
//
// exports.checkView2 = async function checkView(req, res) {
//     try {
//         const opts = removeEmptyProperties(req.query);
//
//         if (!opts.id) {
//             res.status(400)
//                 .json({ error: 'Cannot return snapshot. There is no "id" field in request query' });
//             return;
//         }
//         const check = await Check.findById(opts.id);
//         const test = await Test.findById(`${check.test}`);
//         const suite = await Suite.findById(`${check.suite}`);
//         let baselineSnapshot;
//         if (check.baselineId) {
//             baselineSnapshot = await Snapshot.findById(`${check.baselineId}`)
//                 .exec();
//             baselineSnapshot.formattedCreatedDate = moment(baselineSnapshot.createdDate)
//                 .format('YYYY-MM-DD hh:mm');
//         }
//
//         let actualSnapshot;
//         if (check.actualSnapshotId) {
//             actualSnapshot = await Snapshot.findById(`${check.actualSnapshotId}`);
//             actualSnapshot.formattedCreatedDate = moment(actualSnapshot.createdDate);
//         } else {
//             actualSnapshot = null;
//         }
//         // const diffId = check.diffId ? check.diffId : '';
//
//         let diffSnapshot;
//         if (check.diffId) {
//             diffSnapshot = await Snapshot.findById(`${check.diffId}`);
//             diffSnapshot.formattedCreatedDate = moment(diffSnapshot.createdDate);
//         }
//
//         const checksWithSameName = await checksGroupedByIdent({ name: check.name });
//         const checksWithSameTestId = Array.from(await Check.find({ test: test._id }));
//
//         const currentCheckIndex = checksWithSameTestId.map((x) => x._id.toString())
//             .indexOf(check._id.toString());
//         const countOfChecksWithSameTestId = checksWithSameTestId.length;
//         const prevCheck = async (modelName, id) => {
//             const model = mongoose.model(modelName);
//             return model.findOne({ test: test._id, _id: { $lt: id } })
//                 .sort({ _id: -1 })
//                 .exec();
//         };
//         const nextCheck = async (modelName, id) => {
//             const model = mongoose.model(modelName);
//             return model.findOne({ test: test._id, _id: { $gt: id } })
//                 .sort({ _id: 1 })
//                 .exec();
//         };
//
//         const prevCheckId = currentCheckIndex !== 0 ? (await prevCheck('VRSCheck', check._id))?._id : null;
//         const nextCheckId = currentCheckIndex + 1 !== checksWithSameTestId.length ? (await nextCheck('VRSCheck', check._id))?._id : null;
//
//         let lastChecksWithSameName = [];
//         for (const group of Object.values(checksWithSameName)) {
//             lastChecksWithSameName.push(group.checks[group.checks.length - 1]);
//         }
//         lastChecksWithSameName = lastChecksWithSameName.sort((a, b) => Number(new Date(b.updatedDate) - Number(new Date(a.updatedDate))));
//         const baseline = await Baseline.findOne({ snapshootId: baselineSnapshot._id })
//             .exec();
//         res.render('pages/checkview2', {
//             baselineSnapshot,
//             actualSnapshot,
//             diffSnapshot,
//             baseline,
//             check,
//             test,
//             suite,
//             lastChecksWithSameName,
//             prevCheckId,
//             nextCheckId,
//             currentCheckIndex,
//             countOfChecksWithSameTestId,
//             user: req.user,
//         });
//     } catch (e) {
//         fatalError(req, res, e);
//     }
// };
//
// exports.diffView = async function diffView(req, res) {
//     try {
//         const opts = removeEmptyProperties(req.query);
//         // redirect to new view
//         res.redirect(301, `/checkview?id=${opts.checkid}`);
//     } catch (e) {
//         fatalError(req, res, e);
//     }
// };
