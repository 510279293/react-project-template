/**
 * @file 处理“diyDo返回数据”的函数集，兼容diydo和diydo2
 * @author 杨小强 2024-01-12
 * @modifier
 */
import { hasRole, strIsEmpty, getAliasValue, 
  strToArray, getFileServiceUrl, COMPONENTTYPE, DATATYPE 
} from '@/dvm/utils/dvmResult.js';

/*************************************************************************************核心函数
 * 获取模块权限
 * @param {*} diyData 
 * @param {*} functionList 
 * @returns 
 *************************************************************************************/
export function getUiRole(diyData, functionList){
  // 获取功能权限列表
  let roleFunctionList;
  if(diyData){
    if(diyData.roleFunctions){
      // diydo的返回数据格式
      roleFunctionList = diyData.roleFunctions;
    }
    else{
      if(diyData.data){
        // diydo2的返回数据格式
        roleFunctionList = diyData.data.roleFunction;
      }
      else{
        // 不认识的格式
        roleFunctionList = [];
      }
    }
  }
  else{
    // 不认识的格式
    roleFunctionList = [];
  }
  // 判断是否具备操作权限，写入jsonRole对象
	let jsonRole = {}
	if(functionList != null){
		for(let p in functionList){
			if(p !== 'self') jsonRole[p] = hasRole(roleFunctionList, functionList[p]);
		}
	}
	return jsonRole;
}

/*************************************************************************************核心函数
 * 
 * @param {*} tableData 
 * @param {*} diyData 
 * @param {*} functionAlias 
 * @param {*} enumNameSuffix 
 *************************************************************************************/
export function toUiTableData(tableData, diyData, functionAlias, enumNameSuffix) {
	if (isVaildEnumDiyData(diyData)) {
		if(strIsEmpty(enumNameSuffix)) enumNameSuffix = 'Name';
    let diydo2 = isDiydo2(diyData);
    // 获取字段定义
    let oFieldList = _getFieldList(diydo2, diyData, functionAlias);
    // 插入枚举数据
    for(let j = 0; oFieldList != null && oFieldList.length > 0 && j < oFieldList.length; j++){
      if((diydo2 && isEnumField(oFieldList[j].componentType) && oFieldList[j].isColField == 1) || 
          (!diydo2 && isEnumField(oFieldList[j].DFD_KJLX) && oFieldList[j].DFD_SFLBZD == 1)){
        let enumCaptionName = '';
        if(diydo2){
          enumCaptionName = oFieldList[j].fieldAlias + enumNameSuffix;
        }
        else{
          enumCaptionName = oFieldList[j].DFD_ZDBM + enumNameSuffix;
        }
        let jsonControl = oFieldList[j].json;;
        if(jsonControl != null){
          let isJSLoad = jsonControl.isJSLoad == 1 ? true : false;
          let flag = isJSLoad;
          if(!flag){
            // 通过字段的jsonControl.saveCodeText和数据类型来控制，是否保存显示值
            if(jsonControl.hasOwnProperty('saveCodeText')){
              flag = jsonControl.saveCodeText == 1 ? true : false;
            }
            else{
              if(diydo2){
                flag = DATATYPE.STRING === oFieldList[j].dataType;
              }
              else{
                flag = DATATYPE.STRING === oFieldList[j].DFD_SJLX;
              }
            }
          }
          if(!flag){
            let enumData = getEnumListByJSONControl(diyData, jsonControl);
            if(diydo2){
              toUitableField(tableData, oFieldList[j].fieldAlias, enumCaptionName, enumData);
            }
            else{
              toUitableField(tableData, oFieldList[j].DFD_ZDBM, enumCaptionName, enumData);
            }
          }
        }
      }
    }
	}
}

/*************************************************************************************核心函数
 * 在tableData中，根据field字段的值，在枚举列表找到枚举值，并插入列表中，其字段为enumField
 * @param {JSONArray} 	tableData 			表格数据，同时作为返回值
 * @param {String} 			field 					在表格数据中，保存枚举值的字段
 * @param {String} 			enumField 			在表格数据中，枚举内容要保存的字段
 * @param {JSONArray} 	enumData 				枚举数据
 *************************************************************************************/
export function toUitableField(tableData, field, enumField, enumData) {
	if (tableData != null && tableData.length > 0 && enumData != null && enumData.length > 0 
			&& !strIsEmpty(field) && !strIsEmpty(enumField)) {
		let enumId = 0, enumName = '';
		for (let i = 0; i < tableData.length; i++) {
			enumId = tableData[i][field];
			enumName = getEnumName(enumData, enumId);
			tableData[i][enumField] = enumName;
		}
	}
}

/*************************************************************************************核心函数
 * 根据diydo中字段定义，获取所有相关的枚举信息，目前仅支持下拉选项，树形结构不支持
 * @param {*} diyData 
 * @param {*} enumListSuffix 枚举列表后缀，默认为List
 * @returns 
 *************************************************************************************/
export function getUiEnumList(diyData, enumListSuffix) {
	let jsonObjectResult = {};
	if (isVaildEnumDiyData(diyData)) {
		if(strIsEmpty(enumListSuffix)) enumListSuffix = 'List';
    if(isDiydo2(diyData)){
      if(diyData.data && diyData.data.diydoFunction){
        for(let keyFunction in diyData.data.diydoFunction){
          let oFunction = diyData.data.diydoFunction[keyFunction];
          for(let i = 0; oFunction.diydoFieldList && i < oFunction.diydoFieldList.length; i++){
            let oField = oFunction.diydoFieldList[i];
            if(isEnumField(oField.componentType)){
              let enumListName = oField.fieldAlias + enumListSuffix;
              let jsonControl = oField.json;
              if(jsonControl == null){
                // 从控制json中获取文本，作为枚举数据
                jsonObjectResult[enumListName] = getEnumListByText(oField.controlJson);
              }
              else{
                let isJSLoad = jsonControl.isJSLoad == 1 ? true : false;
                if(!isJSLoad){
                  jsonObjectResult[enumListName] = getEnumListByJSONControl(diyData, jsonControl);
                }
              }
            }
          }
        }
      }
    }
    else{
      for(let i = 0; i < diyData.multiFields.length; i++){
        let jsonFields = diyData.multiFields[i].value;
        for(let j = 0; jsonFields != null && jsonFields.length > 0 && j < jsonFields.length; j++){
          if(isEnumField(jsonFields[j].DFD_KJLX)){
            let enumListName = jsonFields[j].DFD_ZDBM + enumListSuffix;
            let jsonControl = jsonFields[j].json;
            if(jsonControl == null){
              // 定义文本
              jsonObjectResult[enumListName] = getEnumListByText(jsonFields[j].DFD_KZJSON);
            }
            else{
              let isJSLoad = jsonControl.isJSLoad == 1 ? true : false;
              if(!isJSLoad){
                jsonObjectResult[enumListName] = getEnumListByJSONControl(diyData, jsonControl, jsonFields[j].DFD_SJLX);
              }
            }
          }
        }
      }
    }
	}
	return jsonObjectResult;
}

/*************************************************************************************核心函数
 * 获取列表需要显示的数据
 * @param {*} res 
 * @param {*} alias 
 * @returns 
 *************************************************************************************/
export function getDataSource(res, resultName, alias) {
  if(res.data){
    return res.data.records;
  }
  else{
    return getAliasResultBase(res, resultName, alias);
  }
}

/*************************************************************************************核心函数
 * 获取列表的数据行数
 * @param {*} res 
 * @param {*} alias 
 * @param {*} field 
 * @returns 
 *************************************************************************************/
export function getDataTotal(res, alias, field) {
  if(res.data){
    return res.data.total;
  }
  else{
    return getAliasValue(res, alias, field)
  }
}

/*************************************************************************************核心函数
 * 获取导出文件的url
 * @param {*} res 
 * @returns 
 *************************************************************************************/
export function getExportUrl(res) {
  if(typeof res === "string"){
    return res;
  }
  else{
    return getFileServiceUrl(res.data);
  }
}

/** *****************内部基础函数，兼容多种格式的取值
 * 在DVM服务返回的数据中，获取指定节点、指定别名的数据集；本函数可识别两种种res格式，函数内部自动识别格式；
 * 1、若resultName不为空且resultName节点存在，则获取res[resultName].alias下的数据；
 * 2、若resultName为空或resultName节点不存在，则获取res.alias下的数据；
 * @param {*} res 
 * @param {*} resultName 
 * @param {*} alias 
 * @returns 
 */
export function getAliasResultBase(res, resultName, alias) {
	if (res == null) {
		return [];
	} 
  else {
		let aliasResult = [];
		if(!strIsEmpty(resultName)){
      if(isDiydo2(res)){
        let resData = res.data;
        if(resData.hasOwnProperty(resultName)){ 
          return resData[resultName][alias];
        }
        else{
          return [];
        }
      }
      else {
        if(res.hasOwnProperty(resultName) && res[resultName] instanceof Array){
          aliasResult = res[resultName].filter(el => el.alias === alias);
          return _getAliasValue(aliasResult);
        }
        else{
          return [];
        }
      }
		}
		else{
			if(res instanceof Array) {
        aliasResult = res.filter(el => el.alias === alias);
        return _getAliasValue(aliasResult);
      }
      else{
        return [];
      }
    }
	}
}

// ***************************************************************内部函数

/**
 * 获取functionAlias对应的字段定义，若functionAlias为空，则获取第一个字段定义
 * @param {*} diyData 
 * @param {*} functionAlias 
 */
function _getFieldList(isDiydo2, diyData, functionAlias){
  let oFieldList = [];
  if(isDiydo2){
    if(strIsEmpty(functionAlias)){
      if(diyData.data && diyData.data.diydoFunction){
        for(let keyFunction in diyData.data.diydoFunction){
          let oFunction = diyData.data.diydoFunction[keyFunction];
          if(oFunction.diydoFieldList){
            oFieldList = oFunction.diydoFieldList;
            break;
          }
        }
      }
    }
    else{
      oFieldList = getAliasResultBase(diyData, 'diydoFunction', functionAlias);
    }
  }
  else{
    // 获取字段定义
    if(strIsEmpty(functionAlias)){
      // functionAlias为空，则返回第一个
      oFieldList = diyData.multiFields[0].value;
    }
    else{
      // functionAlias不为空，则返回指定的数据
      oFieldList = getAliasResultBase(diyData, 'multiFields', functionAlias);
    }
  }
  return oFieldList;
} 

/**
 * 在diydo的请求数据中，alias内容保存在相同级别的value键值中，可用本方法获取
 * @param {*} aliasResult 
 * @returns 
 */
function _getAliasValue(aliasResult) {
  if (aliasResult != null && aliasResult instanceof Array &&  aliasResult.length > 0) {
    if (aliasResult[0].hasOwnProperty('value')) {
      return aliasResult[0].value || [];
    } 
    else {
      return [];
    }
  } 
  else {
    return [];
	}
}

/**
 * 判断是否diydo2请求返回的数据
 * @param {} res 
 * @returns 
 */
export function isDiydo2(res) {
  let ret = false;
  if(res){
    ret = res.hasOwnProperty('data');
	}
  return ret;
}

/**
 * 根据id，在枚举值中获取名称
 * @param {*} enumData 
 * @param {*} id 
 * @returns 
 */
export function getEnumName(enumData, id) {
	let ret = '';
	if (id != null && enumData != null && enumData.length > 0) {
		for (let i = 0; i < enumData.length; i++) {
			if (id == enumData[i].value) {
				return enumData[i].caption;
			}
		}
	}
	return ret;
}

/**
 * 判断diyDo返回的结果，是否需要枚举处理
 * @param {} diyData 
 * @returns 
 */
export function isVaildEnumDiyData(diyData){
  let ret = false;
  if(diyData){
    if(isDiydo2(diyData)){
      ret = diyData.data.diydoFunction && diyData.data.uiEnum;
    }
    else{
      ret = diyData.multiFields != null && diyData.multiFields.length > 0 && diyData.uiEnumList != null && diyData.uiEnumList.length > 0
    }
  }
	return ret;
}

/**
 * 获取枚举值的key，可通过key获取枚举内容
 * @param {*} jsonControl 
 * @returns 
 */
export function getEnumKey(jsonControl) {
  if(jsonControl.hasOwnProperty("codeType")){
		// 判断是否数据字典，java生成时的规则：codeType;
		return jsonControl.codeType;
	}
	else if(jsonControl.hasOwnProperty("tableName")){
		// 判断是否有tableName，java生成时的规则：tableName+"_"+showField+"_"+valueField+"_"+conditions+"_"+parentField+"_"+orderField;
		let showField = jsonControl.showField ? jsonControl.showField : '';
		let valueField = jsonControl.valueField ? jsonControl.valueField : '';
		let conditions = jsonControl.conditions ? jsonControl.conditions : '';
		let parentField = jsonControl.parentField ? jsonControl.parentField : '';
		let orderField = jsonControl.orderField ? jsonControl.orderField : jsonControl.showField;
		return jsonControl.tableName + "_" + showField + "_" + valueField + "_" + conditions + "_" + parentField + "_" + orderField;
	}
	else{
		return "";
	}
}

/**
 * 遍历tree，获取字段名为[fieldName]、字段值为[fieldValue]的记录，若为null则表示为匹配到
 * getTreeNode(jsonTree, 'id', 666)  表示获取id为666的记录
 * @param {*} jsonTree 
 * @param {*} fieldName 
 * @param {*} fieldValue 
 * @returns 
 */
export function getTreeNode(jsonTree, fieldName, fieldValue) {
	let ret = null, parentNode = null;
	if(!strIsEmpty(fieldValue) && !strIsEmpty(fieldName) && jsonTree != null){
		for (let i = 0; i < jsonTree.length; i++) {
			if (jsonTree[i][fieldName] == fieldValue) {
				ret = jsonTree[i];
				break;
			}
			else{
				parentNode = jsonTree[i];
				if (parentNode.hasOwnProperty('children')) {
					ret = getTreeNode(parentNode.children, fieldName, fieldValue);
					if (ret != null) break;
				}
			}
		}
	}
	return ret
}

/**
 * 把枚举值列表数据，转化树形数据
 * @param {*} data 
 * @param {*} idField 
 * @param {*} captionField 
 * @param {*} pidField 
 * @returns 
 */
export function getEnumTree(data, idField, captionField, pidField) {
	let jsonTree = []
	for (let i = 0; i < data.length; i++) {
		let id = data[i][idField];
		let caption = data[i][captionField];
		let pid = data[i][pidField]

		if (pid === '' || pid === 0 || !pid) {
			jsonTree.push({
				value: id,
				label: caption,
				pid: pid
			})
		} else {
			let parentNode = getTreeNode(jsonTree, 'value', pid)
			if (parentNode != null) {
				if (!parentNode.hasOwnProperty('children')) {
					parentNode.children = []
				}
				parentNode.children.push({
					value: id,
					label: caption,
					pid: pid
				})
			}
		}
	}
	return jsonTree
}

/**
 * 根据原始定义的枚举数据、value字段名、caption字段名，替换界面显示所需的枚举数据
 * @param {*} enumData 
 * @param {*} valueFieldName 
 * @param {*} captionFieldName 
 * @returns 
 */
export function getEnumListReplace(enumData, valueFieldName, captionFieldName) {
	let jsonArray = [];
	if (enumData != null && enumData.length > 0) {
		for(let i = 0; i < enumData.length; i++){
			let jsonObject = {};
			jsonObject.caption = enumData[i][captionFieldName];
			jsonObject.value = enumData[i][valueFieldName];
			jsonArray.push(jsonObject);
		}
	}
	return jsonArray;
}

/**
 * 
 * @param {*} componentType 
 * @returns 
 */
export function isEnumField(componentType) {
	return COMPONENTTYPE.SELECT == componentType || COMPONENTTYPE.SELECTMULTI == componentType
			 || COMPONENTTYPE.TREESELECT == componentType || COMPONENTTYPE.TREESELECTMULTI == componentType
}

/**
 * 在[diy接口返回的数据 + 枚举数据]中，获取指定别名的数据集
 * @param  {[type]} res   [diy接口返回的结果集]
 * @param  {[type]} alias [指定别名]
 * @return {[type]}       [JSONArray]
 */
export function getEnumAliasResult(res, alias) {
  if(isDiydo2(res)){
    return getAliasResultBase(res, 'uiEnum', alias);
  }
  else{
    return getAliasResultBase(res, 'uiEnumList', alias);
  }
}

/**
 * 根据枚举文本，获取界面显示所需的枚举信息
 * @param {*} text 
 * @returns 
 */
export function getEnumListByText(text) {
	var jsonArray = [];
	if(!strIsEmpty(text)){
		var enumData = strToArray(text);
		if(enumData != null && enumData.length > 0) {
			for(var i = 0; i < enumData.length; i++){
				var jsonObject = {};
				jsonObject.caption = enumData[i];
				jsonObject.value = enumData[i];
				jsonArray.push(jsonObject);
			}
		}
	}
	return jsonArray;
}

/**
 * 根据jsonControl，在diyData中获取枚举定义
 * @param {*} diyData 
 * @param {*} jsonControl 
 * @param {*} dataType 
 * @returns 
 */
export function getEnumListByJSONControl(diyData, jsonControl) {
	let enumData = [];
	if(jsonControl != null){
		let key = getEnumKey(jsonControl);
		enumData = getEnumAliasResult(diyData, key);
		if(jsonControl.hasOwnProperty("parentField")){
			enumData = getEnumTree(enumData, jsonControl.valueField, jsonControl.showField, jsonControl.parentField);
		}
		else if(jsonControl.hasOwnProperty("tableName")){
			enumData = getEnumListReplace(enumData, jsonControl.valueField, jsonControl.showField);
		}
	}
	return enumData;
}
