define([
	'./_util',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/date/locale',
	'dojo/store/Memory',
	'gridx/allModules',
	'../support/data/AllData',
	'../support/stores/Memory',
	'dijit/_Widget',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/TextBox',
	'dijit/form/ComboBox',
	'dijit/form/DateTextBox',
	'dijit/form/TimeTextBox',
	'dijit/form/NumberTextBox',
	'dijit/form/FilteringSelect',
	'dijit/form/Select',
	'dijit/form/HorizontalSlider',
	'dijit/form/NumberSpinner',
	'dijit/form/CheckBox',
	'dijit/form/ToggleButton',
	'dijit/Calendar',
	'dijit/ColorPalette'
], function(util, declare, lang, locale, Memory, modules, dataSource, storeFactory,
	_Widget, _TemplatedMixin, _WidgetsInTemplateMixin,
	TextBox, ComboBox, DateTextBox, TimeTextBox, NumberTextBox, FilteringSelect,
	Select, HorizontalSlider, NumberSpinner, CheckBox, ToggleButton, Calendar, ColorPalette){

	function getDate(d){
		res = locale.format(d, {
			selector: 'date',
			datePattern: 'yyyy/M/d'
		});
		return res;
	}
	function getTime(d){
		res = locale.format(d, {
			selector: 'time',
			timePattern: 'hh:mm:ss'
		});
		return res;
	}

	function createSelectStore(field){
		dataSource.resetSeed();
		var data = dataSource.getData({
			size: 100
		}).items;
		//Make the items unique
		var res = {};
		for(var i = 0; i < data.length; ++i){
			res[data[i][field]] = 1;
		}
		data = [];
		for(var d in res){
			data.push({
				id: d
			});
		}
		return new Memory({
			data: data
		});
	}

	mystore = storeFactory({
		dataSource: dataSource, 
		size: 200
	});
	fsStore = createSelectStore('Album');
	selectStore = createSelectStore('Length');

	//Custom edit grid
	declare('gridx.tests.CustomEditor', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: [
			'<table><tr><td style="width: 100px;">',
				'<label>Composer:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.TextBox" data-dojo-attach-point="composer"></div>',
			'</td></tr><tr><td style="width: 100px;">',
				'<label>Song Name:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.TextBox" data-dojo-attach-point="songName"></div>',
			'</td></tr><tr><td style="width: 100px;">',
				'<label>Year:</label>',
			'</td><td>',
				'<div data-dojo-type="dijit.form.NumberTextBox" data-dojo-attach-point="year"></div>',
			'</td></tr></table>'
		].join(''),
		_setValueAttr: function(value){
			console.log(value);
			this.composer.set('value', value[0] || '');
			this.songName.set('value', value[1] || '');
			this.year.set('value', parseInt(value[2], 10));
		},
		_getValueAttr: function(value){
			return [
				this.composer.get('value'),
				this.songName.get('value'),
				this.year.get('value')
			];
		},
		focus: function(){
			this.composer.focus();
		}
	});

	return [
		{
			title: 'dijit editor',
			guide: [
				'every column is editable except ID column',
				'double click cell to enter editing mode',
				'click anywhere else (lose focus) to apply editted content to store',
				'when focus on editable cell, press ENTER to enter editing mode',
				'when in editing mode, press ESC to cancel editing',
				'when in editing mode, press ENTER to apply editted content to store',
				'when in editing mode, press TAB to enter next cell\'s editing mode',
				'when in editing mode of the last cell in the last row, press TAB to enter editing mode of the first cell in the first row.',
				'when in editing mode of the first cell in the first row, press SHIFT+TAB to enter editing mode of the last cell in the last row.'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"ID", width: '20px'},
				{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
					decorator: function(data){
						return [
							'<div style="display: inline-block; border: 1px solid black; ',
							'width: 20px; height: 20px; background-color: ',
							data,
							'"></div>',
							data
						].join('');
					},
					editor: 'dijit.ColorPalette',
					editorArgs: {
						fromEditor: function(v, cell){
							return v || cell.data(); //If no color selected, use the orginal one.
						}
					}
				},
				{ field: "Genre", name:"TextBox", width: '100px', editable: true},
				{ field: "Artist", name:"ComboBox", width: '100px', editable: true,
					editor: "dijit.form.ComboBox",
					editorArgs: {
						props: 'store: mystore, searchAttr: "Artist"'
					}
				},
				{ field: "Year", name:"NumberTextBox", width: '100px', editable: true,
					editor: "dijit.form.NumberTextBox"
				},
				{ field: "Album", name:"FilteringSelect", width: '100px', editable: true,
					editor: FilteringSelect,
					editorArgs: {
						props: 'store: fsStore, searchAttr: "id"'
					}
				},
				{ field: "Length", name:"Select", width: '100px', editable: true,
					//FIXME: this is still buggy, hard to set width
					editor: Select,
					editorArgs: {
						props: 'store: selectStore, labelAttr: "id"'
					}
				},
				{ field: "progress", name:"HorizontalSlider", width: '100px', editable: true,
					editor: "dijit.form.HorizontalSlider",
					editorArgs: {
						props: 'minimum: 0, maximum: 1'
					}
				},
				{ field: "Track", name:"Number Spinner", width: '100px', editable: true,
					width: '50px',
					editor: "dijit.form.NumberSpinner"
				},
				{ field: "Heard", name:"Check Box", width: '30px', editable: true,
					editor: "dijit.form.CheckBox",
					editorArgs: {
						props: 'value: true'
					}
				},
				{ field: "Heard", name:"ToggleButton", width: '100px', editable: true,
					editor: "dijit.form.ToggleButton",
					editorArgs: {
						valueField: 'checked',
						props: 'label: "Press me"'
					}
				},
				{ field: "Download Date", name:"Calendar", width: '180px', editable: true,
					dataType: 'date',
					storePattern: 'yyyy/M/d',
					gridPattern: 'yyyy/MMMM/dd',
					editor: 'dijit.Calendar',
					editorArgs: {
						fromEditor: getDate
					}
				},
				{ field: "Download Date", name:"DateTextBox", width: '100px', editable: true,
					dataType: 'date',
					storePattern: 'yyyy/M/d',
					gridPattern: 'yyyy--MM--dd',
					editor: DateTextBox,
					editorArgs: {
						fromEditor: getDate
					}
				},
				//FIXME: this is still buggy, can not TAB out.
		//        { field: "Composer", name:"Editor", width: '200px', editable: true,
		//            editor: "dijit/Editor"
		//        },
				{ field: "Last Played", name:"TimeTextBox", width: '100px', editable: true,
					dataType: "time",
					storePattern: 'HH:mm:ss',
					formatter: 'hh:mm a',
					editor: TimeTextBox,
					editorArgs: {
						fromEditor: getTime
					}
				}
			],
			modules: [
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar"
			]
		},
		{
			title: 'custom editor',
			guide: [
				'double click cell to enter editing mode',
				'click anywhere else (lose focus) to apply editted content to store',
				'when focus on editable cell, press ENTER to enter editing mode',
				'when in editing mode, press ESC to cancel editing',
				'when in editing mode, press ENTER to apply editted content to store',
				'when in editing mode, press TAB to enter next focusable element in the cell, if no such element, go the next cell\'s editing mode',
				'when in editing mode of the last cell in the last row, press TAB to enter editing mode of the first cell in the first row.',
				'when in editing mode of the first cell in the first row, press SHIFT+TAB to enter editing mode of the last cell in the last row.'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"ID", width: '20px'},
				{ name: "Edit Multiple Fields", editable: true,
					//Construct our own cell data using multiple fields
					formatter: function(rawData){
						return rawData.Composer + ': ' + rawData.Name + ' [' + rawData.Year + ']';
					},
					//Use our own editor
					editor: 'gridx.tests.CustomEditor',
					editorArgs: {
						//Feed our editor with proper values
						toEditor: function(storeData, gridData){
							return [
								lang.trim(gridData.split(':')[0]),
								lang.trim(gridData.split('[')[0].split(':')[1]),
								lang.trim(gridData.split('[')[1].split(']')[0])
							];
						}
					},
					//Define our own "applyEdit" process
					customApplyEdit: function(cell, value){
						return cell.row.setRawData({
							Composer: value[0],
							Name: value[1],
							Year: value[2]
						});
					}
				}
			],
			modules: [
				"gridx/modules/CellWidget",
				"gridx/modules/Edit"
			]
		},
		{
			title: 'alwaysEditing',
			guide: [
				'Use mouse to focus to the editor in cell to begin editing.',
				'click anywhere else (lose focus) to apply editted content to store',
				'Switch to another page, and switch back, to make sure the editted content is really applied to store.',
				'when focus is on cell, press ENTER to move focus to the editor in cell',
				'when focus is on cell, press F2 to move focus to the editor in cell',
				'when focus is on the editor in cell, press ESC to move focus back to cell'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"ID", width: '20px'},
				{ field: "Genre", name:"TextBox", width: '100px', alwaysEditing: true},
				{ field: "Artist", name:"ComboBox", width: '100px', alwaysEditing: true,
					editor: "dijit.form.ComboBox",
					editorArgs: {
						props: 'store: mystore, searchAttr: "Artist"'
					}
				},
				{ field: "Year", name:"NumberTextBox", width: '100px', alwaysEditing: true,
					editor: "dijit.form.NumberTextBox"
				},
				{ field: "Album", name:"FilteringSelect", width: '100px', alwaysEditing: true,
					editor: FilteringSelect,
					editorArgs: {
						props: 'store: fsStore, searchAttr: "id"'
					}
				},
				{ field: "Length", name:"Select", width: '100px', alwaysEditing: true,
					//FIXME: this is still buggy, hard to set width properly
					editor: Select,
					editorArgs: {
						props: 'store: selectStore, labelAttr: "id"'
					}
				},
				{ field: "Progress", name:"HorizontalSlider", width: '100px', alwaysEditing: true,
					editor: "dijit.form.HorizontalSlider",
					editorArgs: {
						props: 'minimum: 0, maximum: 1'
					}
				},
				{ field: "Track", name:"Number Spinner", width: '100px', alwaysEditing: true,
					width: '50px',
					editor: "dijit.form.NumberSpinner"
				},
				{ field: "Heard", name:"Check Box", width: '30px', alwaysEditing: true,
					editor: "dijit.form.CheckBox",
					editorArgs: {
						props: 'value: true'
					}
				},
				{ field: "Heard", name:"ToggleButton", width: '100px', alwaysEditing: true,
					editor: "dijit.form.ToggleButton",
					editorArgs: {
						valueField: 'checked',
						props: 'label: "Press me"'
					}
				},
				{ field: "Download Date", name:"DateTextBox", width: '100px', alwaysEditing: true,
					dataType: 'date',
					storePattern: 'yyyy/M/d',
					gridPattern: 'yyyy--MM--dd',
					editor: DateTextBox,
					editorArgs: {
						fromEditor: getDate
					}
				},
				{ field: "Last Played", name:"TimeTextBox", width: '100px', alwaysEditing: true,
					dataType: "time",
					storePattern: 'HH:mm:ss',
					formatter: 'hh:mm a',
					editor: TimeTextBox,
					editorArgs: {
						fromEditor: getTime
					}
				}
			],
			modules: [
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				"gridx/modules/VirtualVScroller",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar"
			]
		},
		{
			version: 1.2,
			title: 'lazy edit',
			guide: [
				'when apply editting, a green triangle appears at the right top corner of the cell',
				'click undo the undo the last unsaved editing',
				'click redo the redo the last cancelled editing',
				'click save to save changes to store',
				'click discard unsaved changes to undo everything'
			],
			cache: "gridx/core/model/cache/Sync",
			store: 'memory',
			size: 100,
			structure: [
				{ field: "id", name:"ID", width: '20px'},
				{ field: "Color", name:"Color Palatte", width: '205px', editable: true,
					decorator: function(data){
						return [
							'<div style="display: inline-block; border: 1px solid black; ',
							'width: 20px; height: 20px; background-color: ',
							data,
							'"></div>',
							data
						].join('');
					},
					editor: 'dijit.ColorPalette',
					editorArgs: {
						fromEditor: function(v, cell){
							return v || cell.data(); //If no color selected, use the orginal one.
						}
					}
				},
				{ field: "Genre", name:"TextBox", width: '100px', editable: true},
				{ field: "Artist", name:"ComboBox", width: '100px', editable: true,
					editor: "dijit.form.ComboBox",
					editorArgs: {
						props: 'store: mystore, searchAttr: "Artist"'
					}
				},
				{ field: "Year", name:"NumberTextBox", width: '100px', editable: true,
					editor: "dijit.form.NumberTextBox"
				},
				{ field: "Album", name:"FilteringSelect", width: '100px', editable: true,
					editor: FilteringSelect,
					editorArgs: {
						props: 'store: fsStore, searchAttr: "id"'
					}
				},
				{ field: "Length", name:"Select", width: '100px', editable: true,
					//FIXME: this is still buggy, hard to set width
					editor: Select,
					editorArgs: {
						props: 'store: selectStore, labelAttr: "id"'
					}
				},
				{ field: "progress", name:"HorizontalSlider", width: '100px', editable: true,
					editor: "dijit.form.HorizontalSlider",
					editorArgs: {
						props: 'minimum: 0, maximum: 1'
					}
				},
				{ field: "Track", name:"Number Spinner", width: '100px', editable: true,
					width: '50px',
					editor: "dijit.form.NumberSpinner"
				},
				{ field: "Heard", name:"Check Box", width: '30px', editable: true,
					editor: "dijit.form.CheckBox",
					editorArgs: {
						props: 'value: true'
					}
				},
				{ field: "Heard", name:"ToggleButton", width: '100px', editable: true,
					editor: "dijit.form.ToggleButton",
					editorArgs: {
						valueField: 'checked',
						props: 'label: "Press me"'
					}
				},
				{ field: "Download Date", name:"Calendar", width: '180px', editable: true,
					dataType: 'date',
					storePattern: 'yyyy/M/d',
					gridPattern: 'yyyy/MMMM/dd',
					editor: 'dijit.Calendar',
					editorArgs: {
						fromEditor: getDate
					}
				},
				{ field: "Download Date", name:"DateTextBox", width: '100px', editable: true,
					dataType: 'date',
					storePattern: 'yyyy/M/d',
					gridPattern: 'yyyy--MM--dd',
					editor: DateTextBox,
					editorArgs: {
						fromEditor: getDate
					}
				},
				//FIXME: this is still buggy, can not TAB out.
		//        { field: "Composer", name:"Editor", width: '200px', editable: true,
		//            editor: "dijit/Editor"
		//        },
				{ field: "Last Played", name:"TimeTextBox", width: '100px', editable: true,
					dataType: "time",
					storePattern: 'HH:mm:ss',
					formatter: 'hh:mm a',
					editor: TimeTextBox,
					editorArgs: {
						fromEditor: getTime
					}
				}
			],
			modules: [
				"gridx/modules/CellWidget",
				"gridx/modules/Edit",
				modules.Pagination,
				"gridx/modules/pagination/PaginationBar"
			],
			props: {
				editLazySave: true
			},
			onCreated: function(grid){
				util.addButton('undo', function(){
					grid.model.undo();
				});
				util.addButton('redo', function(){
					grid.model.redo();
				});
				util.addButton('save', function(){
					grid.model.save();
				});
				util.addButton('discard unsaved changes', function(){
					grid.model.clearLazyData();
				});
			}
		}
	];
});
