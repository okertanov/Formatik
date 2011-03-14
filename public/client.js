/*
    Formatik Server Application.
    Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
*/

Ext.ns('Formatik','Formatik.views','Formatik.cache','Formatik.stores');
Ext.setup(
{
    icon: 'icon_lg.png',
    tabletStartupScreen: 'echo10_tablet_startup.png',
    phoneStartupScreen: 'echo10_phone_startup.png',
    glossOnIcon: true,
    statusBarStyle: 'black',
    onReady: function() {
        var app = new Formatik.App();
    }
});

Ext.regModel('Order', 
{
    fields: [   
                'id', 'username', 'direction', 'kind', 'category', 'package', 
                'weightclass', 'weight', 'numplaces', 'cost', 'waybill', 
                'datetimereceived', 'datetimestamp', 'description'
            ]
});

Formatik.views.Tasks = Ext.extend(Ext.List, 
{
    id: 'tasks_list',
    title: 'Заказы',
    iconCls: 'bookmarks',
    badgeText: '0',
    scroll: 'vertical',
    layout: 'card',
    itemSelector: '.tasks-list-item',
    grouped: true,
    groups: 'datetimereceived',
    html: 'Загружается...',
    itemTpl : '<tpl for="."><div class="tasks-list-item" id="{id}"><h4 class="datetimereceived">{datetimereceived}</h4><h3 class="direction">{direction}</h3></div></tpl>', 
    
    initComponent: function() 
    {
        this.store = new Ext.data.Store(
        {
            model: 'Order',
            getGroupString: function(record) 
            {
                return record.get('datetimereceived');
            },
            data: 
            [
                {id: '1', datetimereceived: '25 Jan 2010', direction: 'To Riga'},
                {id: '1', datetimereceived: '25 Jan 2010', direction: 'To Kiev'},
                {id: '1', datetimereceived: '25 Jan 2010', direction: 'NY USA'},
                {id: '2', datetimereceived: '24 Jan 2010', direction: 'To Moscow'},
            ]
        });
        
        Formatik.views.Tasks.superclass.initComponent.call(this);
    }  
});

Formatik.views.NewTask = Ext.extend(Ext.Panel, 
{
    title: 'Оформление заказа',
    iconCls: 'favorites',
    layoutConfig: { pack: 'top', align: 'middle' },
    fullscreen: true,
    items: 
    [{
        title: 'NewTask',
        xtype: 'form',
        scroll: 'vertical',
        layout: {type: 'vbox', pack: 'top', align: 'justify'},
        autoScroll: false,
        id: 'new_task_form',
        url: '/api/newtask',
        items: 
        [
            {
                xtype: 'fieldset',
                title: 'Введите соответствующую информацию',
                instructions: 'Внимательно вводите информацию со слов заказчика.',
                defaults: 
                {
                    labelWidth: '25%'
                },
                items: 
                [
                    {
                        xtype: 'selectfield',
                        name: 'direction',
                        label: 'Направление',
                        placeHolder: 'Выберите направление доставки'
                    },
                    {
                        xtype: 'selectfield',
                        name: 'kind',
                        label: 'Вид отправления'
                    },
                    {
                        xtype: 'selectfield',
                        name: 'category',
                        label: 'Категория отправления',
                        placeHolder: 'Тип доставки отправления'
                    },
                    {
                        xtype: 'selectfield',
                        name: 'package',
                        label: 'Упаковка отправления',
                        placeHolder: 'Вид упаковки отправления'
                    },
                    {
                        xtype: 'selectfield',
                        name: 'weightclass',
                        label: 'Вес отправления',
                        placeHolder: 'Вес отправления в кг'
                    },
                    {
                        xtype: 'textfield',
                        name: 'numplaces',
                        label: 'Количество мест',
                        placeHolder: '1 место - 750 х 550 х 500 mm, вес 31,5 kg',
                        useClearIcon: true
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
            },
            /*{
                xtype: 'fieldset',
                title: 'Оформление заказа',
                instructions: 'Введите информацию об оформленном заказе.',
                defaults: 
                {
                    labelWidth: '25%'
                },
                items: 
                [
                    {
                        xtype: 'textfield',
                        name: 'waybill',
                        label: 'Номер накладной',
                        placeHolder: 'Номер транспортной накладной',
                        useClearIcon: true
                    },
                    {
                        xtype: 'textfield',
                        name: 'datetimereceived',
                        label: 'Время оформления',
                        placeHolder: 'DD.MM.YY HH:MM',
                        centered: true,
                        disabled: true,
                        disabledCls: 'x-field',
                        useClearIcon: false,
                        readOnly: true,
                    }
                ]
            },*/
            {
                layout: 'hbox',
                defaults: {xtype: 'button', style: 'margin-right: .5em;'},
                items: 
                [
                    {xtype: 'spacer'},
                    {
                        text: 'Добавить',
                        scope: this,
                        iconMask: true,
                        iconCls: 'add', 
                        ui: 'action',
                        handler: function()
                        {
                            Ext.getCmp('new_task_form').submit({waitMsg : {message:'Submitting'}});
                        }
                    }
                ]
            }
        ]
    }],
    initComponent: function() {
        Formatik.views.NewTask.superclass.initComponent.call(this);
        
        [{id:0,name:'places'}, {id:1,name:'kinds'}, {id:2,name:'categories'}, {id:3,name:'packages'}, {id:4,name:'weightclasses'}].
        forEach( function(el, idx, arr){
            Ext.Ajax.request({
                    url: '/api/catalog/' + el.name,
                    method: 'GET',
                    params : {  },
                    success: function(result, request) 
                    {
                        var reply = Ext.util.JSON.decode(result.responseText);
                        if (reply.success)
                        {
                            var select_obj = Ext.getCmp('new_task_form').items.get(0).items.get(el.id); //form->fieldset(0)->field(0)
                            if ( typeof(select_obj) == 'object' && typeof(reply) == 'object' )
                            {
                                select_obj.setOptions(reply[el.name]);
                                select_obj.reset();
                            }
                        }
                        else
                        {
                            this.failure(result, request);
                        }
                    },
                    failure: function(result, request)
                    {
                        console.dir(result, request);
                        var reply = Ext.util.JSON.decode(result.responseText);
                        var err_str = reply.msg || result;
                        console.log(err_str);
                    }        
            });
        });

        //Set OnXXX handlers
        var obj1 = Ext.getCmp('new_task_form').items.get(0).items.get(0); //form->fieldset(0)->field(0)
        var obj2 = Ext.getCmp('new_task_form').items.get(0).items.get(1); //form->fieldset(0)->field(1)
        var obj3 = Ext.getCmp('new_task_form').items.get(0).items.get(2); //form->fieldset(0)->field(2)
        var obj4 = Ext.getCmp('new_task_form').items.get(0).items.get(3); //form->fieldset(0)->field(3)
        var obj5 = Ext.getCmp('new_task_form').items.get(0).items.get(4); //form->fieldset(0)->field(4)
        var obj6 = Ext.getCmp('new_task_form').items.get(0).items.get(5); //form->fieldset(0)->field(5)
        if ( typeof(obj1) == 'object' )
        {
            obj1.on({
                change: this.onChange,
                select: this.onChange,
                scope: this
            });
        }
        if ( typeof(obj2) == 'object' )
        {
            obj2.on({
                change: this.onChange,
                select: this.onChange,
                scope: this
            });
        }
        if ( typeof(obj3) == 'object' )
        {
            obj3.on({
                change: this.onChange,
                select: this.onChange,
                scope: this
            });
        }
        if ( typeof(obj4) == 'object' )
        {
            obj4.on({
                change: this.onChange,
                select: this.onChange,
                scope: this
            });
        }
        if ( typeof(obj5) == 'object' )
        {
            obj5.on({
                change: this.onChange,
                select: this.onChange,
                scope: this
            });
        }
        if ( typeof(obj6) == 'object' )
        {
            obj6.on({
                change: this.onChange,
                select: this.onChange,
                keyup:  this.onChange,
                scope: this
            });
        }
    },
    onChange: function(field, value)
    {
        console.log('onChange event for: ', field, value);

        var auth = GetLocalAuthConfig();
        var my_form = Ext.getCmp('new_task_form');
        my_form.order = Ext.ModelMgr.create({username: auth.username}, 'Order');
        my_form.updateRecord(my_form.order);

        console.log(my_form.order.data['direction']);
    }
});

Ext.regModel('Operator', 
{
    fields: ['id', 'username', 'password', 'address', 'isadmin', 'description']
});

Formatik.views.Settings = Ext.extend(Ext.Panel, 
{
    title: 'Настройки',
    iconCls: 'settings',
    fullscreen: true,
    items: 
    [{
        title: 'Auth',
        xtype: 'form',
        id: 'settings_form',
        url: '/api/auth',
        scroll: 'vertical',
        items: 
        [
            {
                xtype: 'fieldset',
                title: 'Информация о пункте приема заказов',
                instructions: 'Пожалуйста, попросите куратора ввести информацию о вашем пункте приема заказов.',
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
                        autoCapitalize : false,
                        useClearIcon: true,
                        required: true
                    },
                    {
                        xtype: 'passwordfield',
                        name: 'password',
                        label: 'Пароль',
                        placeHolder: 'Ваш пароль',
                        autoCapitalize : false,
                        useClearIcon: true
                    },
                    {
                        xtype: 'textareafield',
                        name: 'address',
                        label: 'Адрес',
                        placeHolder: 'Ваш адрес',
                        autoCapitalize : true,
                        useClearIcon: true,
                        readOnly: true,
                        disabled: true,
                        disabledCls: 'x-field'
                    }
                ]
            }, 
            {
                layout: 'hbox',
                defaults: {xtype: 'button', style: 'margin-right: .5em;'},
                items: 
                [
                    {xtype: 'spacer'},
                    {
                        text: 'Очистить',
                        scope: this,
                        iconMask: true,
                        iconCls: 'delete',
                        ui: '', 
                        handler: function()
                        {
                            var my_form = Ext.getCmp('settings_form');
                            my_form.operator = Ext.ModelMgr.create({
                                                username: '',
                                                password: '',
                                                address: ''
                            }, 'Operator');
                            my_form.reset();
                            my_form.load(my_form.operator);
                            ResetLocalAuthConfig();
                        }
                    }, 
                    {
                        text: 'Применить',
                        scope: this,
                        iconMask: true,
                        iconCls: 'compose', 
                        ui: 'action',
                        handler: function()
                        {
                            //0. Obtain model  //this stands "Ext.getCmp('settings_form')"
                            var my_form = Ext.getCmp('settings_form');
                            my_form.updateRecord(my_form.operator);
                            my_form.operator.data['password'] = hex_md5(my_form.operator.data['password']);
                            my_form.load(my_form.operator);

                            //1. Post
                            my_form.submit({ 
                                            waitMsg: {message:'Submitting', cls : 'demos-loading'},
                                            //2. Wait for xhr reply on the auth request
                                            success: function(f, result) {
                                                console.dir(result);
                                                //3. Set Cookie
                                                SetLocalAuthConfig(my_form.operator.data['username'], 
                                                    my_form.operator.data['password']);
                                                //4. Set address
                                                my_form.operator.data['address'] = result.address || ''
                                                my_form.load(my_form.operator);
                                                //5. Set username on panel if succeeded otherwise raise an error with alert

                                                //6. Reinit authorized UI
                                            },
                                            failure: function(f, result) {
                                                console.dir(result);
                                                var err_str = result.msg || result.responseText;
                                                Ext.Msg.alert('Error', err_str, Ext.emptyFn);
                                            }
                            });
                        }
                    }
                ]

            }
        ]
    }],
    initComponent: function() {
        Formatik.views.Settings.superclass.initComponent.call(this);

        var my_form = Ext.getCmp('settings_form');

        //1. Set known fields
        var auth = GetLocalAuthConfig();
        my_form.operator = Ext.ModelMgr.create({
                username: auth.username,
                password: auth.password,
                address: ''
            }, 'Operator');
        my_form.load(my_form.operator);

        //2. Ask for the auth and address
        if (auth.username.length && auth.password.length)
        {
            Ext.Ajax.request({
                url: '/api/auth',
                method: 'POST',
                params : { username: auth.username, password: auth.password },
                success: function(result, request) 
                {
                    var reply = Ext.util.JSON.decode(result.responseText);
                    if (reply.success)
                    {
                        my_form.updateRecord(my_form.operator);
                        my_form.operator.data['address'] = reply.address || ''
                        my_form.load(my_form.operator);
                    }
                    else
                    {
                        this.failure(result, request);
                    }
                },
                failure: function(result, request)
                {
                    var reply = Ext.util.JSON.decode(result.responseText);
                    var err_str = reply.msg || result;
                    my_form.updateRecord(my_form.operator);
                    my_form.operator.data['address'] = err_str || ''
                    my_form.load(my_form.operator);
                }        
            });
        }
    }       
});

Formatik.views.Help = Ext.extend(Ext.Panel, {
    title: 'Помощь',
    iconCls: 'info',
    fullscreen: true,
    html: '<center>' + 
                '<h3 style="color:black;">' +
                    '<br />"Pasta un kujeru serviss" centralais birojs<br /><br />' + 
                    'Adrese: Akademijas laukums, 1-141, Riga, Latvija LV 1050<br />' +
                    'Talrunis/fakss: <a>(+371) 67320148</a>, <a>(+371) 67509742</a><br />' +
                    'e-pasts: ' +
                        '<a href="mailto:pastamedia@gmail.com">pastamedia@gmail.com</a><br /><br />' +
                    '<a href="http://www.pks.lv/">www.pks.lv</a>' +
                '</h3>' +
                '<h4 style="color:black;">' + 
                    '<br /><br /><hr width="70%"/><br /><br />Created by Oleg E Kertanov <a href="mailto:okertanov@gmail.com">&lt;okertanov@gmail.com&gt;</a> &nbsp;' + 
                    '&copy; 2011 &nbsp;' + 
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
        console.log('initComponent');

        this.newtask  = new Formatik.views.NewTask();
        this.tasks    = new Formatik.views.Tasks();
        this.settings = new Formatik.views.Settings();
        this.help     = new Formatik.views.Help();

        this.toolbar = new Ext.Toolbar({
            /*title: 'Оформление заказа',*/
            dock: 'top',
            items: [
                {xtype: 'spacer'}, 
                {
                    xtype: 'selectfield',
                    name: 'operator',
                    options: [
                        {text: '',  value: '0'},
                    ]
                }
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

        this.newtask_tab = this.tabs.items.items[0].tab;
        this.tasks_tab = this.tabs.items.items[1].tab;
        this.settings_tab = this.tabs.items.items[2].tab;
        this.help_tab = this.tabs.items.items[3].tab;

        /*Finalize UI*/
        this.baseUIOnAuthConfig( IsLocalAuthConfig(GetLocalAuthConfig()) );
  },
    
  afterRender: function() {
      console.log('afterRender');
      Formatik.App.superclass.afterRender.apply(this, arguments);
      //Ext.getBody().on(Ext.isChrome ? 'click' : 'tap', this.onLinkTap, this, {delegate: 'a.test'});
      this.tabs.items.each(function(card) {
            if (card.scroller) { card.scroller.scrollTo({x: 0, y: 0}, false); }
      });
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
      console.log('onTabChange');
      this.updateToolbarTitle(this.tabs.getActiveItem().title);
  },
    
  onBeforeActivate: function() {
      console.log('onBeforeActivate');
  },
    
  onBeforeDeactivate: function() {
      console.log('onBeforeDeactivate');
  },

    baseUIOnAuthConfig: function(act) {
        var isEnabled = !!act;
        if(act)  
        {
            this.newtask_tab.enable().setVisible(true);
            this.tasks_tab.enable().setVisible(true).setBadge();
            this.tabs.setActiveItem(this.newtask);
        }
        else
        {
            this.newtask_tab.disable().setVisible(false);
            this.tasks_tab.disable().setVisible(false).setBadge();
            this.tabs.setActiveItem(this.settings);
        }
        this.updateToolbarTitle(this.tabs.getActiveItem().title);
    },

});


/**************************************************/
function CreateCookie(name,value,days) 
{
    if (days) 
    {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else 
    {
        var expires = "";
    }

    var cookStr = name + "=" + escape(value) + expires + "; path=/";
    document.cookie = cookStr;
}

function ReadCookie(name) 
{
    var value = null;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) 
            value = unescape(c.substring(nameEQ.length,c.length));
    }

    return value;
}

function DeleteCookie(name) 
{
    CreateCookie(name, "", -1);
}
/**************************************************/

/**************************************************/
function SetLocalAuthConfig(username, password)
{
    CreateCookie('auth', username + ':' + password, 365); 
}

function ResetLocalAuthConfig()
{
    DeleteCookie('auth');
}

function GetLocalAuthConfig()
{
    var cookie = ReadCookie('auth');
    var pair = (cookie ? cookie.split(':') : {});
    var auth = { username: pair[0] || '', password: pair[1] || '' };

    return auth;
}

function IsLocalAuthConfig(auth)
{
    return (auth.username.length && auth.password.length);
}
/**************************************************/

