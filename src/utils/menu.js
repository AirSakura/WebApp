const data = { 'status': 0, 'success': true, 'msg': '查询成功', 'data': [{ 'id': 1, 'title': '系统设置', 'path': '/setting', 'name': 'setting', 'parentid': 0, 'sortindex': null, 'component': 'layout/Layout', 'alwaysShow': true, 'noCache': true, 'icon': 'setting', 'children': [{ 'id': 2, 'title': '用户管理', 'path': 'user', 'name': 'user', 'parentid': 1, 'sortindex': null, 'component': 'setting/user', 'alwaysShow': false, 'noCache': true, 'icon': null, 'children': [{ 'func_id': 1, 'name': '新增用户', 'func': 'admin_user_add:POST', 'menu_id': 2, 'id': '2.1', 'title': '新增用户' }, { 'func_id': 3, 'name': '修改用户', 'func': 'admin_user_edit:POST', 'menu_id': 2, 'id': '2.3', 'title': '修改用户' }, { 'func_id': 5, 'name': '删除用户', 'func': 'admin_user_delete:GET', 'menu_id': 2, 'id': '2.5', 'title': '删除用户' }] }, { 'id': 6, 'title': '单位管理', 'path': 'part', 'name': 'part', 'parentid': 1, 'sortindex': 0, 'component': 'setting/part', 'alwaysShow': false, 'noCache': true, 'icon': null }, { 'id': 7, 'title': '角色管理', 'path': 'role', 'name': 'role', 'parentid': 1, 'sortindex': 0, 'component': 'setting/role', 'alwaysShow': false, 'noCache': true, 'icon': null }, { 'id': 9, 'title': '菜单管理', 'path': 'menu', 'name': 'menu', 'parentid': 1, 'sortindex': 0, 'component': 'setting/menu', 'alwaysShow': false, 'noCache': true, 'icon': '' }] }] }
// const menus = [
//   {
//     path: '/setting',
//     component: 'layout/Layout',
//     alwaysShow: true,
//     name: 'setting',
//     meta: { title: '系统设置', icon: 'setting' },
//     children: [
//       {
//         path: 'part',
//         name: 'part',
//         component: 'setting/part',
//         meta: {
//           title: '单位管理',
//           noCache: true,
//           perms: ['admin_part1:GET', 'admin_addpart:POST', 'admin_editpart:POST', 'admin_delpart:GET']
//         }
//       },
//       {
//         path: '/menu',
//         name: 'menu',
//         component: 'setting/menu',
//         meta: {
//           title: '菜单管理',
//           noCache: true,
//           perms: ['admin_addmenu:POST', 'admin_editmenu:POST', 'admin_delmenu:GET']
//         }
//       },
//       {
//         path: '/role-list',
//         name: 'role',
//         component: 'setting/role',
//         meta: {
//           title: '角色管理',
//           noCache: true,
//           perms: ['admin_role:GET', 'admin_addrole:POST', 'admin_editroleformenu:POST', 'admin_editrole:POST', 'admin_delroleformenu:POST', 'admin_delrole:GET']
//         }
//       },
//       {
//         path: '/user-list',
//         name: 'user',
//         component: 'setting/user',
//         meta: {
//           title: '用户管理',
//           noCache: true,
//           perms: ['admin_user:POST', 'admin_user:POST', 'admin_import_user_file:POST', 'admin_adduser:POST', 'admin_deluser:POST', 'admin_edituser:POST', 'admin_deluser:POST', 'admin_edituserforrole:POST', 'user_management:POST']
//         }
//       }
//     ]
//   }
// ]
