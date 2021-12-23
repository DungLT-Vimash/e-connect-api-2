'use strict';

const Devebot = require('devebot');
const Promise = Devebot.require('bluebird');
const ld = require('lodash');
const moment = require('moment');
function Service(params = {}) {
  const { dataManipulator } = params;

  this.getAgenda = async function (args, opts) {
    try {
      const query = await createFindQuery(args);
      const total = await getTotal(query);
      const page = args.page;
      const { limit } = args;
      const size = parseInt(limit);
      const skip = page * size;
      const data = await dataManipulator.find({
        type: "AgendaModel",
        projection: {
          id: 1,
          name: 1,
          startDate: 1,
          endDate: 1,
          status: 1,
          reason: 1,
          dayoff: 1,
          createdAt: 1
        },
        query: query,
        options: {
          skip: skip,
          limit: size
        }
      })
      return { total: total, result: data }
    }
    catch (err) {
      return Promise.reject(err);
    }
  };

  async function getTotal(query) {
    const total = await dataManipulator.count({
      type: "AgendaModel",
      filter: query
    })
    return total;
  }

  this.editStatus = async function (args) {
    try {
      const data = await dataManipulator.update({
        type: "AgendaModel",
        _id: args.query.id,
        data: {
          status: args.body.status
        }
      });
      return ({ status: 200, msg: 'Update Successfully!' });
    }
    catch (err) {
      return Promise.reject(err);
    }
  }


  async function createFindQuery(args) {
    const { start, end, name, status, startDate, id } = args;
    const nameFind = new RegExp(name);
    const query = {
      $and: [{
        status: { $exists: true }
      }]
    }
    if (!ld.isEmpty(id)) {
      query['$and'].push({
        _id: id
      })
    }
    if (!ld.isEmpty(name)) {
      query['$and'].push({
        name:
        {
          "$regex": nameFind,
          "$options": "i"
        }
      })
    }
    if (!ld.isEmpty(status)) {
      query['$and'].push({
        status: status
      })
    }
    if (!ld.isEmpty(startDate)) {
      query['$and'].push({
        startDate: {
          $lt: moment(startDate)
        },
        endDate: {
          $gte: moment(startDate)
        }
      })
    }
    if (moment(start).isAfter(moment(end))) {
      return Promise.reject({ status: 400, msg: "Invalid date between" });
    }
    else if (!ld.isEmpty(start) || !ld.isEmpty(end)) {
      query['$and'].push({
        $or: [{
          startDate: {
            $gte: moment(start)
          },
          endDate: {
            $lte: moment(end)
          }
        },
        {
          startDate: {
            $lte: moment(start)
          },
          endDate: {
            $gte: moment(start)
          }
        },
        {
          startDate: {
            $lte: moment(end)
          },
          endDate: {
            $gte: moment(end)
          }
        }
        ]
      })
    }
    return query;
  }
  function convertToRegexp(text) {
    if (text === undefined) return undefined;
    text = text.replace(/a/g, '[aáàảãạăắằẳẵặâấầẩẫậ]');
    text = text.replace(/A/g, '[aáàảãạăắằẳẵặâấầẩẫậ]');
    text = text.replace(/d/g, '[dđ]');
    text = text.replace(/D/g, '[dđ]');
    text = text.replace(/e/g, '[eéèẻẽẹêếềểễệ]');
    text = text.replace(/E/g, '[eéèẻẽẹêếềểễệ]');
    text = text.replace(/i/g, '[iíìỉĩị]');
    text = text.replace(/I/g, '[iíìỉĩị]');
    text = text.replace(/o/g, '[oóòỏõọôốồổỗộơớờởỡợ]');
    text = text.replace(/u/g, '[uúùủũụưứừửữự]');
    text = text.replace(/y/g, '[yýỳỷỹỵ]');
    text = text.replace(/O/g, '[oóòỏõọôốồổỗộơớờởỡợ]');
    text = text.replace(/U/g, '[uúùủũụưứừửữự]');
    text = text.replace(/Y/g, '[yýỳỷỹỵ]');
    return { '$regex': new RegExp(text, 'i') };
  }
}


Service.referenceHash = {
  dataManipulator: 'app-datastore/dataManipulator',
};
module.exports = Service;