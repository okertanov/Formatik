/*
    Formatik Server Application.
    Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
*/

Ext.ns('Formatik','Formatik.views','Formatik.cache','Formatik.stores');
Ext.setup({
	icon: 'icon_lg.png',
	tabletStartupScreen: 'echo10_tablet_startup.png',
	phoneStartupScreen: 'echo10_phone_startup.png',
	glossOnIcon: true,
	statusBarStyle: 'black',
	onReady: function() {
		var app = new Formatik.App();
	}
});


Ext.regModel('Tasks', {
    fields: ['id', 'tdate', 'direction']
});

Formatik.views.Tasks = Ext.extend(Ext.List, {
    id: 'tasks_list',
    title: 'Заявки',
    iconCls: 'bookmarks',
    scroll: 'vertical',
    layout: 'card',
    itemSelector: '.tasks-list-item',
    grouped: true,
    groups: 'tdate',
    html: 'Загружается...',
    itemTpl : '<tpl for="."><div class="tasks-list-item" id="{id}"><h4 class="tdate">{tdate}</h4><h3 class="direction">{direction}</h3></div></tpl>', 
    
    initComponent: function() {
        this.store = new Ext.data.Store({
            model: 'Tasks',
            getGroupString: function(record) {
                return record.get('tdate');
            },
            data: 
            [
                {id: '1', tdate: '25 Jan 2010', direction: 'To Riga'},
                {id: '1', tdate: '25 Jan 2010', direction: 'To Kiev'},
                {id: '1', tdate: '25 Jan 2010', direction: 'NY USA'},
                {id: '2', tdate: '24 Jan 2010', direction: 'To Moscow'},
            ]
        });
        
        Formatik.views.Tasks.superclass.initComponent.call(this);
    }  
});

Formatik.views.NewTask = Ext.extend(Ext.Panel, {
	title: 'Новая заявка',
	iconCls: 'favorites',
	fullscreen: true,
    items: 
    [{
        title: 'NewTask',
        xtype: 'form',
        id: 'new_task_form',
        scroll: 'vertical',
        items: 
        [
            {
                xtype: 'fieldset',
                title: 'Введите информацию о новой заявке',
                instructions: 'Внимательно вводите информацию со слов заказчика.',
                defaults: 
                {
                    labelWidth: '25%'
                },
                items: 
                [
                    /*******************************/
                    {
                        xtype: 'selectfield',
                        name: 'direction',
                        label: 'Направление',
                        placeHolder: 'Выберите направление доставки',
                        options: 
                        [
                            {
                                text: 'Maskava',
                                value: '1'
                            },
                            {
                                text: 'Sankt-Pēterburga',
                                value: '2'
                            },
                            {
                                text: 'Apgabala centri Krievija',
                                value: '3'
                            },
                            {
                                text: 'Viļņa, Tallinna',
                                value: '4'
                            },
                            {
                                text: 'Apgabala centri Lietuva, Igaunija',
                                value: '5'
                            },
                            {
                                text: 'Minska',
                                value: '6'
                            },
                            {
                                text: 'Apgabala centri Baltkrievija',
                                value: '7'
                            },
                            {
                                text: 'Kijeva',
                                value: '8'
                            },
                            {
                                text: 'Apgabala centri Ukraina',
                                value: '9'
                            },
                            {
                                text: 'Almati',
                                value: '10'
                            },
                            {
                                text: 'Kazahstāna',
                                value: '11'
                            },
                            {
                                text: 'Ašhabada',
                                value: '12'
                            },
                            {
                                text: 'Biškeka',
                                value: '13'
                            },
                            {
                                text: 'Dušanbe',
                                value: '14'
                            },
                            {
                                text: 'Taškenta',
                                value: '15'
                            },
                            {
                                text: 'Other',
                                value: '99'
                            }
                        ]
                    },
                    {
                        xtype: 'selectfield',
                        name: 'kind',
                        label: 'Вид отправления',
                        options: 
                        [
                            {
                                text: 'Товар',
                                value: '1'
                            },
                            {
                                text: 'Документ',
                                value: '2'
                            },
                            {
                                text: 'Послылка',
                                value: '3'
                            },
                        ]
                    },
                    {
                        xtype: 'selectfield',
                        name: 'type',
                        label: 'Тип доставки',
                        placeHolder: 'Тип доставки отправления',
                        options: 
                        [
                            {
                                text: 'Бизнес тариф',
                                value: '1'
                            },
                            {
                                text: 'Срочный бизнес тариф',
                                value: '2'
                            }
                        ]
                    },
                    {
                        xtype: 'selectfield',
                        name: 'weight',
                        label: 'Вес отправления',
                        placeHolder: 'Вес отправления в кг',
                        options: 
                        [
                            {
                                text: 'Vismaz nekā 200 g',
                                value: '1'
                            },
                            {
                                text: '0,200 g - 0,500 g',
                                value: '2'
                            },
                            {
                                text: '0,501 g - 1 kg',
                                value: '3'
                            },
                            {
                                text: '1 kg - 1,5 kg',
                                value: '4'
                            },
                            {
                                text: '1,501 kg - 2 kg',
                                value: '5'
                            },
                            {
                                text: 'Vairāk 2 kg',
                                value: '6'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Расчетная стоимость доставки',
                instructions: 'Эту стоимость доставки должен одобрить клиент.',
                defaults: 
                {
                    labelWidth: '25%'
                },
                items: 
                [
                    {
                        xtype: 'textfield',
                        name: 'cost',
                        label: 'Стоимость заказа',
                        placeHolder: 'Расчетная стоимость заказа',
                        centered: true,
                        disabled: true,
                        disabledCls: 'x-field',
                        useClearIcon: false,
                        readOnly: true,
                    }
                ]
            }
        ]
    }],
	initComponent: function() {
		Formatik.views.NewTask.superclass.initComponent.call(this);
	}		
});

Formatik.views.Settings= Ext.extend(Ext.Panel, {
	title: 'Настройки',
	iconCls: 'settings',
	fullscreen: true,
    items: 
    [{
        title: 'Auth',
        xtype: 'form',
        id: 'settings_form',
        scroll: 'vertical',
        items: 
        [
            {
                xtype: 'fieldset',
                title: 'Информация о точке приема заказов',
                instructions: 'Пожалуйста, попросите куратора ввести информацию о вашей точке приема заказов.',
                defaults: 
                {
                    labelWidth: '25%'
                },
                items: 
                [
                    {
                        xtype: 'textfield',
                        name: 'username',
                        label: 'Имя пользователя',
                        placeHolder: 'Ваше имя в системе',
                        autoCapitalize : true,
                        useClearIcon: true
                    },
                    {
                        xtype: 'passwordfield',
                        name: 'password',
                        label: 'Пароль',
                        placeHolder: 'Ваш пароль',
                        autoCapitalize : false,
                        useClearIcon: true
                    }
                ]
            }
        ]
    }],
	initComponent: function() {
		Formatik.views.Settings.superclass.initComponent.call(this);
	}		
});

Formatik.views.Help = Ext.extend(Ext.Panel, {
	title: 'Помощь',
	iconCls: 'info',
	fullscreen: true,
    html: '<center>' + 
                '<h3 style="color:black;">' +
                    '<br />"Pasta un kujeru serviss" centrālais birojs<br /><br />' + 
                    'Adrese: Akadēmijas laukums, 1-141, Rīga, Latvija LV 1050<br />' +
                    'Tālrunis/fakss: <a>(+371) 67320148</a>, <a>(+371) 67509742</a><br />' +
                    'e-pasts: ' +
                        '<a href="mailto:pastamedia@gmail.com">pastamedia@gmail.com</a><br /><br />' +
                    '<a href="http://www.pks.lv/">www.pks.lv</a>' +
                '</h3>' +
                '<h4 style="color:black;">' + 
                    '<br /><hr width="80%"/><br /><br />Created by Oleg E Kertanov &copy; 2011 &nbsp; ' + 
                    '<a href="mailto:okertanov@gmail.com">okertanov@gmail.com</a>' +
                '</h4>' +
          '</center>',
	initComponent: function() {
		Formatik.views.Help.superclass.initComponent.call(this);
	}		
});

Formatik.App = Ext.extend(Ext.Panel, {
	cls: 'app',
	fullscreen: true,
	layout: 'card',
	activeItem: 0,
	initComponent: function() {

		this.newtask  = new Formatik.views.NewTask();
		this.tasks    = new Formatik.views.Tasks();
		this.settings = new Formatik.views.Settings();
        this.help     = new Formatik.views.Help();

		this.toolbar = new Ext.Toolbar({
            title: 'Новая заявка',
            dock: 'top',
            items: [
                {xtype: 'spacer'}, 
                /*{
                    xtype: 'selectfield',
                    name: 'operator',
                    options: [
                        {text: 'Operator 1',  value: '1'},
                    ]
                }*/
            ]
        });
		
        this.tabs = new Ext.TabPanel({
            tabBar: { dock: 'bottom', layout: { pack: 'center'} },
            ui: 'dark',
            defaults: { scroll: 'vertical' },
            items: [this.newtask, this.tasks, this.settings, this.help]
        });

		this.dockedItems = [this.toolbar];
		this.items = [this.tabs];
		
		Formatik.App.superclass.initComponent.call(this);

        this.on({
			beforeactivate: this.onBeforeActivate,
			beforedeactivate: this.onBeforeDeactivate,
			scope: this
		});

		var tabBar = this.tabs.getTabBar();
        tabBar.on('change', this.onTabChange, this);
	},
	
	afterRender: function() {
      Formatik.App.superclass.afterRender.apply(this, arguments);
      Ext.getBody().on(Ext.isChrome ? 'click' : 'tap', this.onLinkTap, this, {delegate: 'a.test'});
  },

	onLinkTap: function(e, t) {        
      e.stopEvent();
	
			this.backButton.hide();		
			this.setCard(this.tabs, Formatik.defaultAnim);
			this.tabs.setCard(this.maps, Formatik.defaultAnim);
			this.updateToolbarTitle(this.tabs.getActiveItem().title);
  },

	updateToolbarTitle: function(title) {
			if (title) { this.toolbarTitle = title; } 
			this.toolbar.setTitle(this.toolbarTitle || ' ');
	},
	
	onTabChange: function(tabs, tab, card) {
      this.updateToolbarTitle(this.tabs.getActiveItem().title);
  },
	
	onBeforeActivate: function() {
      this.tabs.items.each(function(card) {
      	if (card.scroller) { card.scroller.scrollTo({x: 0, y: 0}, false); }
      });
  },
    
    onBeforeDeactivate: function() { },


});

