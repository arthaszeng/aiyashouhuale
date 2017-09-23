const AV = require('../libs/av-weapp-min.js');
const dataFormater = require('../libs/dateformater.js');

function registerRole(roleName) {
  const roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', roleName);
  return Promise.resolve(roleQuery.first())
    .then(function (agentRole) {
      const relation = agentRole.getUsers();
      relation.add(AV.User.current());
      return agentRole.save();
    })
}

function deleteRole(roleName) {
  const roleQuery = new AV.Query(AV.Role);
  roleQuery.equalTo('name', roleName);
  return Promise.resolve(roleQuery.first())
    .then(function (agentRole) {
      const relation = agentRole.getUsers();
      relation.remove(AV.User.current());
      return agentRole.save();
    })
}

function bindAgentToAnUser(agentId) {
  const user = AV.User.current();
  user.set('agentId', agentId);
  return user.save();
}

function fetchCommodityById(idName, id) {
  return new AV.Query('Commodity').equalTo(idName, id).first();
}

function fetchCommodityAndAgentsInfo(idName, id) {
  console.log('fetch commodity: id type: ' + idName + '; id: ' + id);
  return fetchCommodityById(idName, id).then(commodity => {
    return getCAGMapsByCommodity(commodity)
      .then(groupMaps => {
        return fetchAgentsByGroupMaps(groupMaps)
          .then(agentsInfo => {
            return {
              commodity: commodity,
              hasBindingCode: !!commodity.attributes.codeId,
              agentsInfo: agentsInfo
            }
          })
      })
  }).catch(error => {
    console.log(error);
  })
}

function fetchAgentByObjectId(id) {
  return new AV.Query('AgentGroup').equalTo('objectId', id).first()
    .catch((err) => {
      console.log('get err', err);
      throw err;
    })
}

function getCAGMapsByCommodity(commodity) {
  const query = new AV.Query('CommodityAgentGroupMap');
  query.equalTo('commodity', commodity);

  return query.find();
}

function fetchMapsByGroup(groupType, group) {
  const mapType = groupType === 'agentGroup' ? 'CommodityAgentGroupMap' : 'CommodityVendorGroupMap';
  const currentGroup = group ? group : new AV.Object(groupType);
  return fetchGroupById(groupType, currentGroup.objectId || currentGroup.id).then(latestGroup => {
    let query = new AV.Query(mapType);
    query.equalTo(groupType, latestGroup).descending('createdAt');
    return Promise.resolve(query.find());
  })
}

function fetchGroupById(groupType, id) {
  let groupQuery = new AV.Query(groupType === 'agentGroup' ? 'AgentGroup' : 'VendorGroup').descending('updatedAt');
  return Promise.resolve(groupQuery.get(id) || '');
}

function fetchCommoditiesByGroupMaps(groupMaps) {
  return Promise.all(
    groupMaps.map(groupMap => {
      return groupMap.get('commodity');
    })
  ).then(commodities => {
    return Promise.all(commodities.map(commodity => {
      return fetchCommodityByObjectId(commodity.id);
    }))
  })
}

function fetchAgentsByGroupMaps(groupMaps) {
  return Promise.all(
    groupMaps.map(cagm => {
      const createdAt = new Date(cagm.getCreatedAt());
      return cagm.get('agentGroup')
        .set('time', dataFormater(createdAt, 'yyyy年mm月dd日'));
    })
  ).then(agentGroups => {
    return Promise.all(agentGroups.map(agentGroup => {
      return fetchAgentByObjectId(agentGroup.id)
        .then(agent => agent.set('time', agentGroup.get('time')));
    }))
  })
}

function fetchUsersByGroup(groupType, group) {
  const query = new AV.Query('User');
  query.equalTo(groupType, group);

  return query.find();
}

function fetchCommodityByObjectId(id) {
  return new AV.Query('Commodity').equalTo('objectId', id).first()
    .then(commodity => {
      let payload = commodity.attributes;
      payload.id = commodity.id;
      payload.updatedAt = dataFormater(new Date(commodity.updatedAt), 'yyyy年mm月dd日');
      return payload;
    }).catch((err) => {
      console.log('get err', err);
      throw err;
    })
}

function validateCodeId(id) {
  return true;
}

function parseScanningResult(scanningResult) {
  console.log(scanningResult);

  const pathInResult = scanningResult.path;
  const scanType = scanningResult.scanType;
  if (!pathInResult) {
    return {};
  }
  const path = pathInResult.split('?')[0];
  const queryString = pathInResult.split('?')[1];

  const query = queryString.split('&').reduce((pre, cur) => {
    const key = cur.split('=')[0];
    const parentCode = cur.split('=')[1].split('_')[0];
    const subCode = cur.split('=')[1].split('_')[1];
    const isSubCode = parentCode === subCode;

    pre[key] = {
      parentCode: parentCode,
      subCode: subCode,
      isSubCode: isSubCode,
      codeType: scanType === 'QR_CODE' ? 'parentCode' : 'subCode'
    };
    return pre;
  }, {});

  return {
    path,
    query,
  }
}

function hasRole(roles, roleName) {
  return roles.filter(role => role === roleName).length > 0;
}

function getUser() {
  return AV.User.current();
}

function queryAdmins() {
  const roleQuery = new AV.Query(AV.Role);

  roleQuery.equalTo('name', 'admin');

  return roleQuery.first().then(function (adminRole) {
    let userRelation = adminRole.relation('users');
    return userRelation.query().find();
  }).catch(function (error) {
    console.log(error);
  });
}

function queryGroupsByGroupName(groupType, groupName) {
  const queryString = !groupName || groupName === '' ? '$%^^&*(' : groupName;
  const query = new AV.Query(groupType === 'agentGroup' ? 'AgentGroup' : 'VendorGroup');
  query.contains('name', queryString);
  return query.find();
}

function fetchUserByName(username) {
  const query = new AV.Query('User');
  query.equalTo('username', username);
  return query.find();
}

function SET_ROLE_FOR_TEST(roleName, that) {
  that.setData({
    role: roleName
  });
  console.log('[success]: set role ' + roleName + ' for test')
}

function getCurrentFormatDate() {
  const date = new Date();
  const separator = "-";
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return year + separator + month + separator + strDate;
}

function translateTime(agentTime) {
  return agentTime;
}

function judgeRole(roles) {
  const roleMap = new Map();
  roleMap.set('user', 1);
  roleMap.set('agent', 2);
  roleMap.set('vendor', 3);
  roleMap.set('admin', 4);

  const weightMap = new Map();
  weightMap.set(1, 'user');
  weightMap.set(2, 'agent');
  weightMap.set(3, 'vendor');
  weightMap.set(4, 'admin');

  let roleWeight = roles.map(role => roleMap.get(role));

  return weightMap.get(roleWeight.sort().reverse()[0]);
}

function isExistingCodeId(codeId) {
  const query = new AV.Query('Commodity');
  query.equalTo('codeId', codeId);
  return query.find();
}

function showSuccess(message) {
  wx.showToast({title: message, icon: "success", mask: true, duration: 1500});
}

function showSuccessAndBack(message) {
  wx.showToast({
    title: message, icon: "success", mask: true, duration: 1500,
    success: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  });
}

function showFail(message) {
  wx.showToast({title: message, icon: "loading", mask: true, duration: 1000});
}

function showCancel(message) {
  wx.showToast({title: message='已取消', icon: "loading", mask: true, duration: 1000});
}

function showFailAndBack(message) {
  wx.showToast({
    title: message, icon: "loading", mask: true, duration: 1000,
    success: function () {
      wx.navigateBack({
        delta: 1
      })
    }
  });
}

function showLoading(message) {
  wx.showLoading({title: message ? message : "加载中", mask: true});
}

function hideLoading() {
  wx.hideLoading();
}

function isEmptyObject(e) {
  let t;
  for (t in e)
    return !1;
  return !0
}

function getToday() {
  return dataFormater(new Date(), 'yyyy-mm-dd');
}

function redirectToHint (hintType) {
  wx.redirectTo({
    url: `../hint/hint?type=${hintType}`
  });
}

module.exports = {
  validateCodeId,
  getCAGMapsByCommodity,
  fetchGroupById,
  fetchMapsByGroup,
  fetchCommoditiesByGroupMaps,
  fetchAgentsByGroupMaps,
  fetchCommodityAndAgentsInfo,
  fetchCommodityById,
  fetchAgentByObjectId,
  fetchCommodityByObjectId,
  parseScanningResult,
  judgeRole,
  registerRole,
  deleteRole,
  bindAgentToAnUser,
  hasRole,
  getUser,
  fetchUserByName,
  queryAdmins,
  queryGroupsByGroupName,
  SET_ROLE_FOR_TEST,
  getCurrentFormatDate,
  translateTime,
  showSuccess,
  showCancel,
  showSuccessAndBack,
  showFail,
  showFailAndBack,
  showLoading,
  hideLoading,
  isExistingCodeId,
  fetchUsersByGroup,
  isEmptyObject,
  getToday,
  redirectToHint
};
