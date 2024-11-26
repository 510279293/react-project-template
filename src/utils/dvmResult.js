/**
 * @file 处理“DVM服务返回数据”和“DiyDo接口返回数据”的函数集
 * @author 杨小强 2020-07-01
 * @modifier
 */
// -------------------------------------------------以下是：常量定义
// 资源文件服务的前缀
const resourceServicePre = ''
// 数据类型
export const DATATYPE = {
	INT: 1,
	FLOAT: 2,
	DOUBLE: 3,
	DECIMAL: 4,
	STRING: 10,
	CLOB: 11,
	DATE: 20,
	TIME: 21,
	DATETIME: 22,
	BLOB: 30
};
// 控件类型
export const COMPONENTTYPE = {
	DEFAULT: 0,						//根据字段数据类型，对应显示组件；默认
	TEXT: 1,							//文本框
	DATE: 2,							//日期
	TIME: 3,							//时间
	DATETIME: 4,					//日期时间
	MEMO: 5,							//备注框
	EDITOR: 6,						//普通html编辑器
	EDTIOR_WEIXIN: 7,			//微信HTML编辑器
	EDITOR_CODE: 8,				//代码编辑器
	EDTIOR_QUILL: 9,			//Quill编辑器
	NUMBER: 10,						//数字编辑框
	SELECT: 40,						//下拉框-单选
	SELECTMULTI: 41,			//下拉框-多选（mutilCombo:一个界面风格）
	TREESELECT: 50,				//树形选择-单选
	TREESELECTMULTI: 51,	//树形选择-多选
	JSUPLOAD: 60,					//文件上传（dvm-upload）
	WORD: 70 							//显示文字
};
// -------------------------------------------------以下是：从DVM返回结果中取值的函数
/**
 * 在DVM服务返回的数据中，获取指定别名的数据集；本函数可识别三种res格式，函数内部自动识别格式；
 * 1、dvm接口返回的数据，即获取res.result.alias下的数据；
 * 2、dvm接口返回数据中，result节点下的数据，即获取res.alias下的数据；
 * 3、diyDo接口返回的数据，即获取res.dataResult.alias下的数据；
 * @param  {JSONObject} res   	[DVM服务返回的结果集]
 * @param  {String} 	alias 	[别名]
 * @return {JSONArray}
 */
export function getAliasResult(res, alias) {
	if (res == null) {
		return []
	} else {
		if (res.hasOwnProperty('dataResult')) {
			return getAliasResultBase(res, 'dataResult', alias);
		}
		else if (res.hasOwnProperty('result')) {
			return getAliasResultBase(res, 'result', alias);
		}
		else {
			return getAliasResultBase(res, '', alias);
		}
	}
}

/** *****************内部基础函数
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
		return []
	} else {
		var aliasResult = [];
		if(!strIsEmpty(resultName) && res.hasOwnProperty(resultName)){
			aliasResult = res[resultName].filter(el => el.alias === alias);
		}
		else{
			if(res instanceof Array) aliasResult = res.filter(el => el.alias === alias);
		}
		
		if (aliasResult != null && aliasResult.length > 0) {
			if (aliasResult[0].hasOwnProperty('value')) {
				return aliasResult[0].value || []
			} else {
				return []
			}
		} else {
			return []
		}
	}
}

/**
 * 获取getAliasResult()返回值【本函数的返回值为JSONArray】中，首行的对象
 * @param  {JSONObject} res   	[DVM服务返回的结果集]
 * @param  {String} 	alias 	[别名]
 * @return {JSONArray}
 */
export function getAliasObject(res, alias) {
	let list = getAliasResult(res, alias)
	if (!list.length) return null
	return list[0]
}

/**
 * 在指定数据集中，获取指定行、指定字段的值
 * @param  {[type]} aliasResult [指定别名的数据集]
 * @param  {[type]} row         [指定行号，首行从0开始]
 * @param  {[type]} fieldName   [指定字段名]
 * @return {[type]}             [description]
 */
export function getFieldValueBase(aliasResult, row, fieldName) {
	if (aliasResult != null && aliasResult.length > row) {
		var obj = aliasResult[row]
		if (obj.hasOwnProperty(fieldName)) {
			return obj[fieldName]
		} else {
			return null
		}
	} else {
		return null
	}
}

/**
 * 在指定数据集中，获取首行、指定字段的值
 * @param  {[type]} aliasResult [指定别名的数据集]
 * @param  {[type]} fieldName   [指定字段名]
 * @return {[type]}             [description]
 */
export function getFieldValue(aliasResult, fieldName) {
	return getFieldValueBase(aliasResult, 0, fieldName)
}

/**
 * 在DVM返回的结果集中，获取指定别名下、指定行、指定字段的值
 * @param  {[type]} res       [DVM服务返回的结果集]
 * @param  {[type]} alias     [指定别名]
 * @param  {[type]} row       [指定行号，首行从0开始]
 * @param  {[type]} fieldName [指定字段名]
 * @return {[type]}           [description]
 */
export function getAliasValueBase(res, alias, row, fieldName) {
	var aliasResult = getAliasResult(res, alias)
	return getFieldValueBase(aliasResult, row, fieldName)
}

/**
 * 在DVM返回的结果集中，获取指定别名下、首行指定字段的值
 * @param  {[type]} res       [DVM服务返回的结果集]
 * @param  {[type]} alias     [指定别名]
 * @param  {[type]} fieldName [指定字段名]
 * @return {[type]}           [description]
 */
export function getAliasValue(res, alias, fieldName) {
	return getAliasValueBase(res, alias, 0, fieldName)
}

/**
 * 获取系统参数
 * @param {*} res 
 * @param {*} sysParamName 
 * @returns 
 */
export function getSysParamValue(res, sysParamName) {
	if (res && res.sysParamList) {
		if (res.sysParamList.hasOwnProperty(sysParamName)) {
			return res.sysParamList[sysParamName]
		} else {
			return ''
		}
	} else {
		return ''
	}
}

/**
 * 
 * @param {*} jsonArray 
 * @param {*} seachField 
 * @param {*} searchValue 
 * @param {*} returnField 
 * @returns 
 */
export function findArrayField(jsonArray, seachField, searchValue, returnField) {
	let ret = '';
	if (!strIsEmpty(returnField)) {
		let node = findArrayNode(jsonArray, seachField, searchValue);
		if(node != null){
			ret = node[returnField];
		}
	}
	return ret;
}

export function findArrayNode(jsonArray, seachField, searchValue) {
	let ret = null;
	if (jsonArray != null && jsonArray.length > 0 && !strIsEmpty(seachField) && !strIsEmpty(searchValue)) {
		for (let i = 0; i < jsonArray.length; i++) {
			if (searchValue === jsonArray[i][seachField]) {
				ret = jsonArray[i];
				break;
			}
		}
	}
	return ret;
}

export function isExistInArray(array, value) {
	let ret = false;
	if (array != null && array.length > 0 && !strIsEmpty(value)) {
		for (let i = 0; i < array.length; i++) {
			if (value == array[i]) {
				ret = true;
				break;
			}
		}
	}
	return ret;
}

/**
 * 获取jsonArray指定制定key的值，多个值用","间隔，以String格式返回；注意须过滤部分值
 * @param {*} jsonArray 
 * @param {*} key 
 * @returns 
 */
export function getArrayField(jsonArray, key) {
	var ret = '';
	if (jsonArray != null && jsonArray.length > 0 && !strIsEmpty(key)) {
		for (var i = 0; i < jsonArray.length; i++) {
			var value = jsonArray[i][key];
			if (!strIsEmpty(value) && !(value == '操作' || value == 'action')) {
				if (!strIsEmpty(ret)) ret = ret + ',';
				ret = ret + value;
			}
		}
	}
	return ret;
}

/**
 * 获取jsonArray指定制定key的值，以数组格式返回
 * @param {*} jsonArray 
 * @param {*} key 
 * @returns 
 */
export function getArrayFieldToArray(jsonArray, key) {
	var ret = [];
	if (jsonArray != null && jsonArray.length > 0 && !strIsEmpty(key)) {
		for (var i = 0; i < jsonArray.length; i++) {
			var value = jsonArray[i][key];
			if (!strIsEmpty(value)) {
				ret.push(value);
			}
		}
	}
	return ret;
}

/**
 * 根据导入接口的返回结果，生成显示用户的消息
 * @param {*} result 
 * @returns 
 */
export function getImportDesc(result) {
	var message = '查看导入状态出现未知异常';
	if(result != null){
		var jsonArrayAlias = getAliasResult(result, "import_log");
		if(jsonArrayAlias != null && jsonArrayAlias.length > 0){
			var jsonLog = jsonArrayAlias[0];
			// 导入状态     1:处理中;2:处理完成（无异常）;3:处理完成（有异常）;4:终止处理
			var state = jsonLog.DI_DRZT;
			// 总记录数
			var nCount = jsonLog.DI_ZJLS;
			// 导入条数
			var nSuccessCount = jsonLog.DI_CGSL;
			// 错误条数
			var nErrorCount = jsonLog.DI_CWSL;
			// 表示在导入中，执行的过程数据， 异常描述
			var description = jsonLog.DI_CWMS;

			if(state == 1){
				message = '数据导入中...，共' + nCount + '条，已导入' + nSuccessCount + '条，错误' + nErrorCount + '条';
				if(!strIsEmpty(description)) message = message + '。错误描述：' + description;
			}
			else if(state == 2){
				message = '所有数据已成功导入，共' + nCount + '条，已导入' + nSuccessCount + '条';
			}
			else if(state == 3){
				message = '导入结束，共' + nCount + '条，已导入' + nSuccessCount + '条，错误' + nErrorCount + '条';
				if(!strIsEmpty(description)) message = message + '。错误描述：' + description;
			}
			else{
				message = '导入终止，共' + nCount + '条，已导入' + nSuccessCount + '条，错误' + nErrorCount + '条';
				if(!strIsEmpty(description)) message = message + '。错误描述：' + description;
			}
		}
		else{
			message = '流水号[' + import_index + "]导入任务不存在";
		}
	}
	return message;
}


// -------------------------------------------------以下是：枚举值相关的函数
/**
 * 判断是否枚举替换
 * @param {*} componentType 
 * @returns 
 */
export function isEnumField(componentType) {
	return COMPONENTTYPE.SELECT == componentType || COMPONENTTYPE.SELECTMULTI == componentType
			 || COMPONENTTYPE.TREESELECT == componentType || COMPONENTTYPE.TREESELECTMULTI == componentType
}

/**
 * 
 * @param {*} jsonControl 
 * @returns 
 */
export function getEnumKey(jsonControl) {
	if(jsonControl.hasOwnProperty("tableName")){
		// 判断是否有tableName
		// java生成时的规则：tableName+"_"+showField+"_"+valueField+"_"+conditions+"_"+parentField+"_"+orderField;
		let showField = jsonControl.showField ? jsonControl.showField : '';
		let valueField = jsonControl.valueField ? jsonControl.valueField : '';
		let conditions = jsonControl.conditions ? jsonControl.conditions : '';
		let parentField = jsonControl.parentField ? jsonControl.parentField : '';
		let orderField = jsonControl.orderField ? jsonControl.orderField : jsonControl.showField;
		return jsonControl.tableName + "_" + showField + "_" + valueField + "_" + conditions + "_" + parentField + "_" + orderField;
	}
	else if(jsonControl.hasOwnProperty("codeType")){
		// 判断是否数据字典，java生成时的规则：codeType;
		return jsonControl.codeType;
	}
	else{
		return "";
	}
}

/**
 * 判断diyDo返回的结果，是否需要枚举处理
 * @param {} diyData 
 * @returns 
 */
export function isVaildEnumDiyData(diyData){
	return diyData != null 
		&& diyData.multiFields != null && diyData.multiFields.length > 0
		&& diyData.uiEnumList != null && diyData.uiEnumList.length > 0
}

/**
 * 根据diydo中字段定义，获取所有相关的枚举信息，目前仅支持下拉选项，树形结构不支持
 * @param {*} diyData 
 * @param {*} enumListSuffix 枚举列表后缀，默认为List
 * @returns 
 */
export function getAllEnumList(diyData, enumListSuffix) {
	var jsonObjectResult = {};
	if (isVaildEnumDiyData(diyData)) {
		if(strIsEmpty(enumListSuffix)) enumListSuffix = 'List';
		for(var i = 0; i < diyData.multiFields.length; i++){
			var jsonFields = diyData.multiFields[i].value;
			for(var j = 0; jsonFields != null && jsonFields.length > 0 && j < jsonFields.length; j++){
				if(isEnumField(jsonFields[j].DFD_KJLX)){
					var enumListName = jsonFields[j].DFD_ZDBM + enumListSuffix;
					var jsonControl = jsonFields[j].json;
					if(jsonControl == null){
						// 定义文本
						jsonObjectResult[enumListName] = getEnumListByText(jsonFields[j].DFD_KZJSON);
					}
					else{
						var isJSLoad = jsonControl.isJSLoad == 1 ? true : false;
						if(!isJSLoad){
							jsonObjectResult[enumListName] = getEnumListByJSONControl(diyData, jsonControl, jsonFields[j].DFD_SJLX);
						}
					}
				}
			}
		}
	}
	return jsonObjectResult;
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
export function getEnumListByJSONControl(diyData, jsonControl, dataType) {
	var enumData = [];
	if(jsonControl != null){
		var key = getEnumKey(jsonControl);
		var enumData = getEnumAliasResult(diyData, key);
		
		if(jsonControl.hasOwnProperty("parentField")){
			enumData = getEnumTree(enumData, jsonControl.valueField, jsonControl.showField, jsonControl.parentField);
		}
		else if(jsonControl.hasOwnProperty("tableName")){
			enumData = getEnumListReplace(enumData, jsonControl.valueField, jsonControl.showField);
		}
		else {
			// 仅数据字典有效，下拉框保存显示值；通过字段的jsonControl.saveCodeText和数据类型来控制
			// let flag = false;
			// if(jsonControl.hasOwnProperty('saveCodeText')){
			// 	flag = jsonControl.saveCodeText == 1 ? true : false;
			// }
			// else{
			// 	flag = DATATYPE.STRING === dataType;
			// }
			// if(flag){
			// 	enumData = getEnumListReplace(enumData, 'caption', 'caption');
			// }
			// vue脚本中，若要保存caption，在前端脚本中处理
		}
	}
	return enumData;
}

/**
 * 根据原始定义的枚举数据、value字段名、caption字段名，替换界面显示所需的枚举数据
 * @param {*} enumData 
 * @param {*} valueFieldName 
 * @param {*} captionFieldName 
 * @returns 
 */
export function getEnumListReplace(enumData, valueFieldName, captionFieldName) {
	var jsonArray = [];
	if (enumData != null && enumData.length > 0) {
		for(var i = 0; i < enumData.length; i++){
			var jsonObject = {};
			jsonObject.caption = enumData[i][captionFieldName];
			jsonObject.value = enumData[i][valueFieldName];
			jsonArray.push(jsonObject);
		}
	}
	return jsonArray;
}

/**
 * 在[diy接口返回的数据 + 枚举数据]中，获取指定别名的数据集
 * @param  {[type]} res   [diy接口返回的结果集]
 * @param  {[type]} alias [指定别名]
 * @return {[type]}       [JSONArray]
 */
export function getEnumAliasResult(res, alias) {
	return getAliasResultBase(res, 'uiEnumList', alias);
}

export function convertTableData(tableData, diyData, functionAlias, enumNameSuffix) {
	if (isVaildEnumDiyData(diyData)) {
		if(strIsEmpty(enumNameSuffix)) enumNameSuffix = 'Name';
		// 获取字段定义
		let jsonFields = [];
		if(strIsEmpty(functionAlias)){
			// functionAlias为空，则返回第一个
			jsonFields = diyData.multiFields[0].value;
		}
		else{
			// functionAlias不为空，则返回指定的数据
			jsonFields = getAliasResultBase(diyData, 'multiFields', functionAlias);
		}
		// 替换枚举数据
		for(let j = 0; jsonFields != null && jsonFields.length > 0 && j < jsonFields.length; j++){
			if(isEnumField(jsonFields[j].DFD_KJLX) && jsonFields[j].DFD_SFLBZD == 1){
				let enumCaptionName = jsonFields[j].DFD_ZDBM + enumNameSuffix;
				let jsonControl = jsonFields[j].json;
				if(jsonControl != null){
					let isJSLoad = jsonControl.isJSLoad == 1 ? true : false;
					let flag = isJSLoad;
					if(!flag){
						// 通过字段的jsonControl.saveCodeText和数据类型来控制，是否保存显示值
						if(jsonControl.hasOwnProperty('saveCodeText')){
							flag = jsonControl.saveCodeText == 1 ? true : false;
						}
						else{
							flag = DATATYPE.STRING === jsonFields[j].DFD_SJLX;
						}
					}
					if(!flag){
						let enumData = getEnumListByJSONControl(diyData, jsonControl, jsonFields[j].DFD_SJLX);
						tableDataDoWithEnum(tableData, jsonFields[j].DFD_ZDBM, enumCaptionName, enumData);
					}
				}
			}
		}
	}
}

/**
 * 在tableData中，根据field字段的值，在枚举列表找到枚举值，并插入列表中，其字段为enumField
 * @param {JSONArray} 	tableData 			表格数据，同时作为返回值
 * @param {String} 			field 					在表格数据中，保存枚举值的字段
 * @param {String} 			enumField 			在表格数据中，枚举内容要保存的字段
 * @param {JSONArray} 	enumData 				枚举数据
 */
export function tableDataDoWithEnum(tableData, field, enumField, enumData) {
	if (tableData != null && tableData.length > 0 && enumData != null && enumData.length > 0 
			&& !strIsEmpty(field) && !strIsEmpty(enumField)) {
		var enumId = 0, enumName = '';
		for (var i = 0; i < tableData.length; i++) {
			enumId = tableData[i][field];
			enumName = getEnumName(enumData, enumId);
			tableData[i][enumField] = enumName;
		}
	}
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

// -------------------------------------------------以下是：tree相关的函数
/**
 * 在json数组中，获取指定字段的所有值，包括子节点中的
 * @param {*} jsonTree 							json对象
 * @param {*} fieldName 						字段名
 * @param {*} fieldValueArray 			返回的数组
 */
export function getTreeAllValue(jsonTree, fieldName, fieldValueArray){
	for(let i = 0; jsonTree != null && i < jsonTree.length; i++){
		fieldValueArray.push(jsonTree[i][fieldName]);
		if (jsonTree[i].hasOwnProperty('children')) {
			getTreeAllValue(jsonTree[i].children, fieldName, fieldValueArray);
		}
	}
}

/*
* 在json数组中，获取指定字段的值，以及其子节点中的指定字段的值
* @param {*} jsonTree 						json对象
* @param {*} fieldName 						字段名
* @param {*} fieldValueArray 			返回的数组
*/
export function findTreeValueIncludeSub(jsonTree, seachField, searchValue, fieldName, fieldValueArray){
 	for(let i = 0; jsonTree != null && i < jsonTree.length; i++){
		if(jsonTree[i][seachField] == searchValue) {
			fieldValueArray.push(jsonTree[i][fieldName]);
			if (jsonTree[i].hasOwnProperty('children')) {
				getTreeAllValue(jsonTree[i].children, fieldName, fieldValueArray);
			}
		}
		if (jsonTree[i].hasOwnProperty('children')) {
			findTreeValueIncludeSub(jsonTree[i].children, seachField, searchValue, fieldName, fieldValueArray);
		}
	}
}

/**
 * 在json数组中，查找满足条件的指定字段的所有值，包括子节点中的
 * @param {*} jsonTree 
 * @param {*} seachField 
 * @param {*} searchValue 
 * @param {*} fieldName 
 * @param {*} fieldValueArray 
 */
export function findTreeValue(jsonTree, seachField, searchValue, fieldName, fieldValueArray){
	for(let i = 0; jsonTree != null && i < jsonTree.length; i++){
		if(jsonTree[i][seachField] == searchValue) fieldValueArray.push(jsonTree[i][fieldName]);
		if (jsonTree[i].hasOwnProperty('children')) {
			findTreeValue(jsonTree[i].children, seachField, searchValue, fieldName, fieldValueArray);
		}
	}
}

/**
 * 把列表转化为树形结构；本方法执行效率低，但对列表无顺序要求
 * @param {*} data 						列表数据
 * @param {*} idField 				id字段
 * @param {*} pidField 				子父关系字段
 * @param {*} rootPid 				根节点的pid值
 * @returns 
 */
export function listToTreePro(data, idField, pidField, rootPid){
	let jsonTree = [];
	for (let i = 0; i < data.length; i++) {
		let pid = data[i][pidField];
		let id = data[i][idField];
		if (pid === rootPid) {
			let node = data[i];
			let children = listToTreePro(data, idField, pidField, id)
			if(children != null && children.length > 0) node.children = children;
			jsonTree.push(node);
		}
	}
	return jsonTree;
}

/**
 * 把列表转化为树形结构，本方法执行效率高，对列表数据排序有要求，父节点必须排在子节点前
 * @param {*} data 						列表数据
 * @param {*} idField 				id字段
 * @param {*} pidField 				子父关系字段
 * @returns 
 */
export function listToTree(data, idField, pidField) {
	let jsonTree = [], oldPid = '';
	let parentNode = null;
	for (let i = 0; i < data.length; i++) {
		let pid = data[i][pidField]
		if (pid === '' || pid === 0 || !pid) {
			jsonTree.push(data[i]);
		} else {
			if(pid !== oldPid) parentNode = getTreeNode(jsonTree, idField, pid)
			if (parentNode == null) {
				jsonTree.push(data[i])
			} else {
				if (!parentNode.hasOwnProperty('children')) {
					parentNode.children = []
				}
				parentNode.children.push(data[i])
			}
			oldPid = pid;
		}
	}
	return jsonTree
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

export function getTreeNodeLike(jsonTree, fieldName, fieldValue) {
	let ret = null, parentNode = null;
	for (let i = 0; jsonTree != null && i < jsonTree.length; i++) {
		let str = jsonTree[i][fieldName];
		if (!strIsEmpty(str)){
			if(str.indexOf(fieldValue) >= 0){
				ret = jsonTree[i];
				break;
			}
			else{
				parentNode = jsonTree[i];
				if (parentNode.hasOwnProperty('children')) {
					ret = getTreeNodeLike(parentNode.children, fieldName, fieldValue);
					if (ret != null) break;
				}
			}
		}
	}
	return ret
}

/**
 * 在tableData中，根据field字段的值，在树形数据中找到对应的内容，插入列表数据中，其字段为treeField
 * @param {*} tableData 								表格数据，同时作为返回值
 * @param {*} field 										在表格数据中，保存树形数据的id字段
 * @param {*} treeField 								在表格数据中，树形内容要保存的字段
 * @param {*} treeData 									树形数据
 * @param {*} treeValueField 						树形数据中，保存id的字段
 * @param {*} treeCaptionField 					树形数据中，保存名称的字段
 */
export function tableDataDoWithTree(tableData, field, treeField, treeData, treeIdield, treeNameField) {
	if (tableData != null && tableData.length > 0 && treeData != null && treeData.length > 0 
			&& !strIsEmpty(field) && !strIsEmpty(treeField)) {
		let nodeId = 0, nodeName = '';
		for (let i = 0; i < tableData.length; i++) {
			nodeId = tableData[i][field];
			let node = getTreeNode(treeData, treeIdield, nodeId);
			if(node == null){
				nodeName = '';
			}
			else{
				nodeName = node[treeNameField];
			}
			tableData[i][treeField] = nodeName;
		}
	}
}
// -------------------------------------------------以下是：全局通用的函数




/**
 * 获取文件服务中url的全路径
 * 判断url是否为"http://"或"https://"开始，若不是则增加前缀
 * @param {*} imageServerPre 		文件服务器前缀
 * @param {*} url 					文件url
 * @returns 
 */
export function getFileServiceUrl(url){
	return getFileServiceUrlBase(resourceServicePre, url);
}

/**
 * 获取文件服务中url的全路径
 * 判断url是否为"http://"或"https://"开始，若不是则增加前缀
 * @param {*} urlPre 		    文件服务器前缀
 * @param {*} url 					文件url
 * @returns 
 */
export function getFileServiceUrlBase(urlPre, url){
	if(strIsEmpty(url)){
		return url;
	}
	else{
		if(url.indexOf('http://') != -1 || url.indexOf('https://') != -1 ){
			return url
		}
		else{
			return urlPre + url;
		}
	}
}

/**
 * 判断是否有操作权限
 * @param {*} roleFunctions 
 * @param {*} dvmControl 
 * @returns 
 */
export function hasRole(roleFunctions, dvmControl){
	if(strIsEmpty(dvmControl) || roleFunctions == null || roleFunctions.length <= 0){
		return false;
	}
	else{
		for(let i = 0; i < roleFunctions.length; i++){
			if(roleFunctions[i] === dvmControl) return true;
		}
		return false;
	}
}

/**
 * 识别权限
 * @param {*} roleFunctions 
 * @param {*} dvmControl 
 * @returns 
 */
export function getRole(roleFunctions, functionList){
	let jsonRole = {}
	if(functionList != null){
		for(let p in functionList){
			if(p !== 'self') jsonRole[p] = hasRole(roleFunctions, functionList[p]);
		}
	}
	return jsonRole;
}

/**
 * 判断字符串是否为空
 * @param {*} str 
 * @returns 
 */
export function strIsEmpty(str){
	return str == undefined || str == null || str.length <= 0
}

/**
 * 获取html格式中文字内容
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
 export function getHtmlContent(html) {
	var ret = '';
	if(html != null || html.length > 0){
		ret = html.replace(/<.*?>/g, "");
	}
	return ret;
}

/**
 * 把字符串转化为数组，支持","、"\n"、";"分割
 * @param {*} str 
 * @returns 
 */
export function strToArray(str){
	if(strIsEmpty(str)){
		return null;
	}
	else{
		if(str.indexOf(",") > 0)
			return str.split(",");
		else if(str.indexOf("\n") > 0)
			return str.split("\n");
		else if(str.indexOf(";") > 0)
			return str.split(";");
		else
			return null;
	}
}

/**
 * 
 * @param {*} str 
 * @returns 
 */
export function encryption(str){
	if(strIsEmpty(str)){
		return '';
	}
	else{
		let char1 = Math.floor(Math.random() * 10);
		let char2 = Math.floor(Math.random() * 10);
		if(str.length > 4){
			str = str.substr(0, 3) + char1 + str.substr(3);
			if(str.length > 8){
				str = str.substr(0, 6) + char2 + str.substr(6);
			}
		}
		return str;
	}
}