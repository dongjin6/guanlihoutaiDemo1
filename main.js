$(function() {
    // ====== 身份切换 ======
    let currentRole = 'site'; // site: 站点, auditor: 审核员
    if ($('.role-switch').length === 0) {
        $('.header').append('<div class="role-switch" style="margin-left:30px;display:flex;align-items:center;gap:8px;"><span>当前身份：</span><select id="role-select"><option value="site">鉴定站点</option><option value="auditor">参数审核员</option></select></div>');
    }
    $(document).on('change', '#role-select', function() {
        currentRole = $(this).val();
        if ($('.menu-item.active').data('module') === 'plan') {
            $('#main-content').html(getPlanModuleHtml());
            bindPlanModuleEvents();
        }
    });

    // ====== Toast & Modal ======
    function showToast(msg) {
        if ($('.toast').length === 0) {
            $('body').append('<div class="toast"></div>');
        }
        $('.toast').text(msg).fadeIn(200);
        setTimeout(function() { $('.toast').fadeOut(300); }, 1800);
    }
    function showModal(title, content, onConfirm, onCancel, confirmText) {
        if ($('.modal-mask').length === 0) {
            $('body').append('<div class="modal-mask"></div><div class="modal"><div class="modal-title"></div><div class="modal-content"></div><div class="modal-actions"><button class="modal-btn confirm">确定</button><button class="modal-btn cancel">取消</button></div></div>');
        }
        $('.modal-title').text(title);
        $('.modal-content').html(content || '');
        $('.modal-btn.confirm').text(confirmText || '确定');
        $('.modal-mask, .modal').fadeIn(150);
        $('.modal-btn.confirm').off('click').on('click', function() {
            $('.modal-mask, .modal').fadeOut(150);
            if (onConfirm) onConfirm();
        });
        $('.modal-btn.cancel').off('click').on('click', function() {
            $('.modal-mask, .modal').fadeOut(150);
            if (onCancel) onCancel();
        });
    }

    // ====== 计划数据结构 ======
    let planList = [];
    let auditorName = '张审核';

    // ====== 日结算任务数据结构 ======
    let settlementList = [];

    // ====== 考评任务委派数据结构 ======
    let assignList = [];
    let assignSettings = { random: false };
    const orgs = ['A机构', 'B机构', 'C机构'];
    const allEvaluators = [
        {name:'王一',id:'E001'}, {name:'李二',id:'E002'}, {name:'张三',id:'E003'},
        {name:'赵四',id:'E004'}, {name:'孙五',id:'E005'}, {name:'周六',id:'E006'}
    ];

    // ====== 设备标识管理数据结构 ======
    let deviceList = [];
    const deviceTypes = ['终端A', '终端B', '终端C'];
    const deviceOrgs = ['A机构', 'B机构', 'C机构'];
    const deviceSites = ['考点1', '考点2', '考点3'];
    const deviceRooms = ['考场1', '考场2', '考场3'];
    const deviceAreas = ['考区1', '考区2', '考区3'];
    
    // ====== 考核时长预警数据结构 ======
    let durationWarningList = [];
    let durationWarningThreshold = 30; // 默认预警时长阈值（分钟）
    const durationWarningPlans = ['2023年5月计划', '2023年6月计划', '2023年7月计划'];
    // 模拟考生数据
    const studentNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
    const studentDirections = ['软件开发', '网络工程', '数据分析', '人工智能'];
    const studentLevels = ['初级', '中级', '高级'];
    const evaluatorNames = ['王评', '李考', '张核', '赵查'];
    
    // ====== 跨区考评预警数据结构 ======
    let crossAreaWarningList = [];
    const examAreas = ['考区1', '考区2', '考区3', '考区4', '考区5'];
    const examRooms = ['考场1', '考场2', '考场3', '考场4'];
    // 模拟考评员数据
    const evaluatorList = [
        {name: '王评', idCard: '110101198001010011'},
        {name: '李考', idCard: '110101198103050022'},
        {name: '张核', idCard: '310101198205070033'},
        {name: '赵查', idCard: '440101198307090044'},
        {name: '钱评', idCard: '510101198409110055'},
        {name: '孙考', idCard: '330101198511130066'}
    ];
    // 模拟考评机构
    const evaluatorOrgs = ['A机构', 'B机构', 'C机构', 'D机构'];
    
    // ====== 考生信息数据结构 ======
    let studentList = [
        {
            id: 1,
            name: '张三',
            idCard: '110101200001010123',
            org: 'A机构',
            plan: '2023年5月计划',
            photo: '已上传',
            status: '',  // approved: 审核通过, pending: 待审核, rejected: 已驳回
            direction: '软件开发',
            level: '中级'
        },
        {
            id: 2,
            name: '李四',
            idCard: '310101200103050456',
            org: 'B机构',
            plan: '2023年6月计划',
            photo: '已上传',
            status: '',
            direction: '网络工程',
            level: '初级'
        },
        {
            id: 3,
            name: '王五',
            idCard: '440101200205070789',
            org: 'C机构',
            plan: '2023年7月计划',
            photo: '已上传',
            status: '',
            direction: '数据分析',
            level: '高级'
        },
        {
            id: 4,
            name: '赵六',
            idCard: '510101200307090012',
            org: 'A机构',
            plan: '2023年7月计划',
            photo: '已上传',
            status: '',
            direction: '人工智能',
            level: '中级'
        },
        {
            id: 5,
            name: '钱七',
            idCard: '330101200409110345',
            org: 'B机构',
            plan: '2023年8月计划',
            photo: '已上传',
            status: '',
            direction: '软件开发',
            level: '高级'
        }
    ];
    
    // ====== 考生信息修改申请数据结构 ======
    let studentEditList = [
        {
            id: 1,
            studentId: 3,
            studentName: '王五',
            studentIdCard: '440101200205070789',
            org: 'C机构',
            plan: '2023年7月计划',
            modifyType: '姓名',
            oldValue: '王五',
            newValue: '王武',
            reason: '姓名与身份证不符，需要更正',
            evidence: '已上传身份证照片',
            applyTime: '2023-07-15 10:30:45',
            applyUser: '张工作人员',
            status: 'approved',
            approveUser: '李审核',
            approveTime: '2023-07-16 14:20:30',
            rejectReason: ''
        },
        {
            id: 2,
            studentId: 4,
            studentName: '赵六',
            studentIdCard: '510101200307090012',
            org: 'A机构',
            plan: '2023年7月计划',
            modifyType: '照片',
            oldValue: '原照片',
            newValue: '新照片',
            reason: '原照片不清晰，需要更换',
            evidence: '已上传新照片',
            applyTime: '2023-07-18 11:15:22',
            applyUser: '李工作人员',
            status: 'pending',
            approveUser: '',
            approveTime: '',
            rejectReason: ''
        },
        {
            id: 3,
            studentId: 2,
            studentName: '李四',
            studentIdCard: '310101200103050456',
            org: 'B机构',
            plan: '2023年6月计划',
            modifyType: '身份证号',
            oldValue: '310101200103050456',
            newValue: '310101200103050478',
            reason: '身份证号录入错误，需要更正',
            evidence: '已上传身份证照片',
            applyTime: '2023-06-25 14:40:55',
            applyUser: '王工作人员',
            status: 'rejected',
            approveUser: '张审核',
            approveTime: '2023-06-26 09:10:45',
            rejectReason: '提供的证据不足，无法确认身份证号是否需要修改'
        }
    ];
    
    // ====== 禁考管理数据结构 ======
    let banList = [
        {
            id: 1,
            name: '张作弊',
            idCard: '110101200001010123',
            org: 'A机构',
            plan: '2023年5月计划',
            cheatingType: '夹带资料',
            description: '考生在考试过程中被发现携带与考试内容相关的笔记，违反考场规则。',
            cancelScore: true,
            cancelCertificate: true,
            banFuture: true,
            banPeriod: '12',
            status: 'approved',
            applyTime: '2023-05-15 09:30:45',
            evidence: '已上传佐证材料',
            applyUser: '李监考',
            approveUser: '王审核',
            approveTime: '2023-05-16 14:20:30',
            approveComment: '证据确凿，同意处理',
            rejectReason: ''
        },
        {
            id: 2,
            name: '李代考',
            idCard: '310101200103050456',
            org: 'B机构',
            plan: '2023年6月计划',
            cheatingType: '代考',
            description: '经核实，参加考试人员与报名信息不符，存在代考行为。',
            cancelScore: true,
            cancelCertificate: true,
            banFuture: true,
            banPeriod: 'forever',
            status: 'approved',
            applyTime: '2023-06-20 10:15:22',
            evidence: '已上传佐证材料',
            applyUser: '张监考',
            approveUser: '王审核',
            approveTime: '2023-06-21 11:05:18',
            approveComment: '情节严重，建议永久禁考',
            rejectReason: ''
        },
        {
            id: 3,
            name: '王抄袭',
            idCard: '440101200205070789',
            org: 'C机构',
            plan: '2023年7月计划',
            cheatingType: '抄袭他人',
            description: '考生在考试过程中多次偷看并抄袭相邻考生的答案。',
            cancelScore: true,
            cancelCertificate: false,
            banFuture: true,
            banPeriod: '6',
            status: 'pending',
            applyTime: '2023-07-10 14:40:55',
            evidence: '已上传佐证材料',
            applyUser: '赵监考',
            approveUser: '',
            approveTime: '',
            approveComment: '',
            rejectReason: ''
        },
        {
            id: 4,
            name: '赵通讯',
            idCard: '510101200307090012',
            org: 'A机构',
            plan: '2023年7月计划',
            cheatingType: '使用通讯设备',
            description: '考生在考试过程中使用隐藏的通讯设备接收外部信息。',
            cancelScore: true,
            cancelCertificate: true,
            banFuture: true,
            banPeriod: '24',
            status: 'rejected',
            applyTime: '2023-07-12 16:25:33',
            evidence: '已上传佐证材料',
            applyUser: '钱监考',
            approveUser: '王审核',
            approveTime: '2023-07-13 09:10:45',
            approveComment: '',
            rejectReason: '证据不足，无法确认是否存在作弊行为，建议进一步调查'
        },
        {
            id: 5,
            name: '钱其他',
            idCard: '330101200409110345',
            org: 'D机构',
            plan: '2023年7月计划',
            cheatingType: '其他作弊行为',
            description: '考生在考试过程中使用特制工具替换答题卡内容。',
            cancelScore: true,
            cancelCertificate: false,
            banFuture: true,
            banPeriod: '12',
            status: 'pending',
            applyTime: '2023-07-15 11:30:20',
            evidence: '已上传佐证材料',
            applyUser: '孙监考',
            approveUser: '',
            approveTime: '',
            approveComment: '',
            rejectReason: ''
        }
    ];
    
    
    // 设备信息简写映射表
    const deviceMappings = {
        org: {
            'A': 'A机构',
            'B': 'B机构',
            'C': 'C机构'
        },
        site: {
            '1': '考点1',
            '2': '考点2',
            '3': '考点3'
        },
        room: {
            '1': '考场1',
            '2': '考场2',
            '3': '考场3'
        },
        area: {
            '1': '考区1',
            '2': '考区2',
            '3': '考区3'
        }
    };
    
    // 获取完整名称的函数
    function getFullName(type, code) {
        return deviceMappings[type] && deviceMappings[type][code] ? deviceMappings[type][code] : code;
    }

    // ====== 功能模块内容模板 ======
    const modules = {
        plan: getPlanModuleHtml(),
        settlement: '<div class="card"><h2>成绩日结算任务备案</h2><div>这里是成绩日结算任务备案模块内容。</div></div>',
        assign: '<div class="card"><h2>考评任务委派</h2><div>这里是考评任务委派模块内容。</div></div>',
        device: '<div class="card"><h2>设备标识管理</h2><div>这里是设备标识管理模块内容。</div></div>',
        duration: getDurationModuleHtml(),
        cross: getCrossAreaModuleHtml(),
        ban: '<div class="card"><h2>禁考管理</h2><div>这里是禁考管理模块内容。</div></div>',
        edit: '<div class="card"><h2>信息修改权限</h2><div>这里是信息修改权限模块内容。</div></div>',
        audit: '<div class="card"><h2>资料审核优化</h2><div>这里是资料审核优化模块内容。</div></div>',
        screen: '<div class="card"><h2>数据大屏</h2><div>这里是数据大屏模块内容。</div></div>'
    };

    // ====== 初始加载 ======
    $('#main-content').html(modules.plan);
    bindPlanModuleEvents();
    $('.menu-item').click(function() {
        $('.menu-item').removeClass('active');
        $(this).addClass('active');
        const module = $(this).data('module');
        if(module === 'plan') {
            $('#main-content').html(getPlanModuleHtml());
            bindPlanModuleEvents();
        } else if(module === 'settlement') {
            $('#main-content').html(getSettlementModuleHtml());
            bindSettlementModuleEvents();
        } else if(module === 'assign') {
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
        } else if(module === 'device') {
            $('#main-content').html(getDeviceModuleHtml());
            bindDeviceModuleEvents();
        } else if(module === 'duration') {
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        } else if(module === 'cross') {
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
        } else if(module === 'ban') {
            $('#main-content').html(getBanModuleHtml());
            bindBanModuleEvents();
        } else if(module === 'edit') {
            $('#main-content').html(getEditModuleHtml());
            bindEditModuleEvents();
        } else if(module === 'audit') {
            $('#main-content').html(getAuditModuleHtml());
            bindAuditModuleEvents();
        } else if(module === 'screen') {
            $('#main-content').html(getScreenModuleHtml());
            bindScreenModuleEvents();
        } else {
            $('#main-content').html(modules[module]);
        }
    });

    // ====== 计划模块HTML ======
    function getPlanModuleHtml() {
        let html = `<div class="card">
            <h2>鉴定计划备案</h2>
            ${currentRole === 'site' ? `
            <form id="plan-form" class="plan-form">
                <label>计划名称：<input type="text" name="name" required></label>
                <label>计划时间：<input type="month" name="date" required></label>
                <label>参数上报截止时间：<input type="date" name="deadline" required></label>
                <button type="submit">创建计划模板</button>
            </form>` : ''}
            <div style="display:flex;justify-content:space-between;align-items:center;margin:18px 0 8px 0;">
                <h3 style="margin:0;">所有鉴定计划</h3>
                <div>
                    <button class="export-plan" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">导出</button>
                </div>
            </div>
            <table class="plan-table">
                <thead>
                    <tr><th>计划名称</th><th>计划时间</th><th>截止时间</th><th>状态</th><th>参数</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${planList.length === 0 ? '<tr><td colspan="6">暂无鉴定计划</td></tr>' : planList.map((item, idx) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.date}</td>
                            <td>${item.deadline}</td>
                            <td>${getPlanStatusText(item.status)}</td>
                            <td>${item.param ? item.param : '-'}</td>
                            <td>
                                <button class="view-log" data-idx="${idx}">审批日志</button>
                                <button class="view-order" data-idx="${idx}">工单</button>
                                ${currentRole === 'site' && item.status === 'param' ? `<button class="report-param" data-idx="${idx}">参数上报</button>` : ''}
                                ${currentRole === 'auditor' && item.status === 'wait' ? `<button class="audit-param" data-idx="${idx}">审核</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    function getPlanStatusText(status) {
        switch(status) {
            case 'param': return '参数上报中';
            case 'wait': return '待审核';
            case 'pass': return '已审核';
            case 'reject': return '已驳回';
            default: return '-';
        }
    }

    // ====== 计划模块事件 ======
    function bindPlanModuleEvents() {
        // 创建计划模板
        $('#plan-form').on('submit', function(e) {
            e.preventDefault();
            const name = $(this).find('input[name="name"]').val().trim();
            const date = $(this).find('input[name="date"]').val();
            const deadline = $(this).find('input[name="deadline"]').val();
            if(!name || !date || !deadline) {
                showToast('请填写完整信息！');
                return;
            }
            planList.push({
                name,
                date,
                deadline,
                status: 'param',
                param: '',
                log: [{action:'创建计划', user:'站点', time:nowTime(), detail:`计划名称：${name}`}],
                order: {param:'', auditor:'', auditTime:'', result:'', reason:''}
            });
            $('#main-content').html(getPlanModuleHtml());
            bindPlanModuleEvents();
            showModal('请填写月计划量', '<div style="margin:18px 0;">计划模板创建成功，请及时填写本月计划量参数！</div>', function(){}, null, '知道了');
        });
        // 参数上报
        $('.report-param').on('click', function() {
            const idx = $(this).data('idx');
            showModal('参数上报', `<form id="param-form"><label>月计划量：<input type="number" name="param" min="1" required></label></form>`, function() {
                const val = $('#param-form input[name="param"]').val();
                if(!val) { showToast('请填写月计划量！'); return; }
                planList[idx].param = val;
                planList[idx].status = 'wait';
                planList[idx].log.push({action:'参数上报', user:'站点', time:nowTime(), detail:`上报参数：${val}`});
                $('#main-content').html(getPlanModuleHtml());
                bindPlanModuleEvents();
                showToast('参数上报成功，等待审核！');
            }, null, '上报');
        });
        // 审批日志
        $('.view-log').on('click', function() {
            const idx = $(this).data('idx');
            const logs = planList[idx].log.map(l => `<div style="margin-bottom:8px;"><b>${l.action}</b> - ${l.user} - ${l.time}<br><span style="color:#888;">${l.detail}</span></div>`).join('');
            const auditorInfo = `<div style="margin-bottom:12px;color:#2d8cf0;font-weight:bold;">审核人：${auditorName}</div>`;
            showModal('审批日志', auditorInfo + (logs || '暂无日志'), null, null, '关闭');
        });
        // 工单详情
        $('.view-order').on('click', function() {
            const idx = $(this).data('idx');
            const order = planList[idx].order;
            let html = `<div>参数：${planList[idx].param || '-'}</div>`;
            if(planList[idx].status === 'pass' || planList[idx].status === 'reject') {
                html += `<div>审核人：${order.auditor}</div><div>审核时间：${order.auditTime}</div><div>审核结果：${order.result}</div><div>驳回原因：${order.reason || '-'}</div>`;
            }
            showModal('工单详情', html, null, null, '关闭');
        });
        // 审核/驳回
        $('.audit-param').on('click', function() {
            const idx = $(this).data('idx');
            showModal('参数审核', `<form id="audit-form"><label><input type="radio" name="result" value="pass" checked>通过</label> <label><input type="radio" name="result" value="reject">驳回</label><div id="reject-reason" style="display:none;margin-top:8px;"><input type="text" name="reason" placeholder="请输入驳回原因"></div></form>`, function() {
                const result = $('#audit-form input[name="result"]:checked').val();
                const reason = $('#audit-form input[name="reason"]').val();
                planList[idx].order.auditor = auditorName;
                planList[idx].order.auditTime = nowTime();
                planList[idx].order.result = result === 'pass' ? '通过' : '驳回';
                planList[idx].order.reason = result === 'reject' ? reason : '';
                planList[idx].status = result === 'pass' ? 'pass' : 'reject';
                planList[idx].log.push({action: result==='pass'?'审核通过':'审核驳回', user:auditorName, time:nowTime(), detail: result==='pass'?'参数审核通过':('驳回原因：'+reason)});
                $('#main-content').html(getPlanModuleHtml());
                bindPlanModuleEvents();
                showToast(result==='pass'?'审核通过！':'已驳回！');
            }, null, '提交');
            $('#audit-form input[name="result"]').on('change', function() {
                if($(this).val()==='reject') {
                    $('#reject-reason').show();
                } else {
                    $('#reject-reason').hide();
                }
            });
        });
        // 导出
        $('.export-plan').on('click', function() {
            if(planList.length===0) { showToast('暂无数据可导出'); return; }
            // 添加UTF-8 BOM标记，解决Excel打开中文乱码问题
            let csv = '\uFEFF计划名称,计划时间,截止时间,状态,参数\n';
            planList.forEach(item=>{
                csv += `${item.name},=\"${item.date}\",=\"${item.deadline}\",${getPlanStatusText(item.status)},${item.param||'-'}\n`;
            });
            const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '鉴定计划备案.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('导出成功！');
        });
    }

    // ====== 更新settlement模块内容 ======
    function getSettlementModuleHtml() {
        // 日期筛选
        const today = new Date();
        const todayStr = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
        let filterDate = window.settleFilterDate || todayStr;
        // 任务筛选
        const filtered = settlementList.filter(item=>item.date===filterDate);
        let html = `<div class="card">
            <h2>成绩日结算任务上报备案</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <label>筛选日期：<input type="date" id="settle-date-filter" value="${filterDate}"></label>
                <button class="add-settle" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">上报日任务</button>
                <button class="batch-read" style="background:#52c41a;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">批量已读</button>
            </div>
            <table class="plan-table">
                <thead>
                    <tr><th>日期</th><th>考生总数</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? '<tr><td colspan="4">暂无任务</td></tr>' : filtered.map((item, idx) => `
                        <tr class="${item.read ? '' : 'unread-row'}">
                            <td>${item.date}</td>
                            <td>${item.stat.total}</td>
                            <td>${item.read ? '已读' : '未读'}</td>
                            <td>
                                <button class="view-settle" data-idx="${item.id}">查看详情</button>
                                ${!item.read ? `<button class="mark-read" data-idx="${item.id}">标记已读</button>` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    // ====== 绑定settlement模块事件 ======
    function bindSettlementModuleEvents() {
        // 日期筛选
        $('#settle-date-filter').on('change', function() {
            window.settleFilterDate = $(this).val();
            $('#main-content').html(getSettlementModuleHtml());
            bindSettlementModuleEvents();
        });
        // 上报日任务
        $('.add-settle').on('click', function() {
            const today = new Date();
            const todayStr = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
            // 生成模拟考生数据
            const types = ['初考', '补考'];
            const statuses = ['正常', '缺考', '延期'];
            const students = [];
            const stuCount = Math.floor(Math.random()*6)+10; // 10~15人
            for(let i=0;i<stuCount;i++){
                const type = types[Math.random()<0.7?0:1]; // 70%初考
                let statusRand = Math.random();
                let status = '正常';
                if(statusRand>0.85) status = '缺考';
                else if(statusRand>0.7) status = '延期';
                students.push({
                    name: '考生'+(i+1),
                    id: 'ID'+(1000+i),
                    type,
                    status
                });
            }
            // 统计
            const total = students.length;
            const makeup = students.filter(s=>s.type==='补考').length;
            const first = students.filter(s=>s.type==='初考').length;
            const actual = students.filter(s=>s.status==='正常').length;
            const absent = students.filter(s=>s.status==='缺考').length;
            const delay = students.filter(s=>s.status==='延期').length;
            // 生成考生表格
            let stuTable = `<table class='plan-table' style='margin-bottom:18px;'><thead><tr><th>姓名</th><th>身份证</th><th>类型</th><th>状态</th></tr></thead><tbody>`;
            students.forEach(s=>{
                stuTable += `<tr><td>${s.name}</td><td>${s.id}</td><td>${s.type}</td><td>${s.status}</td></tr>`;
            });
            stuTable += '</tbody></table>';
            showModal('上报日结算任务', `
                <div style='font-weight:bold;margin-bottom:8px;'>今日考生信息</div>
                ${stuTable}
                <form id="settle-form">
                <label>日期：<input type="date" name="date" value="${todayStr}" required></label><br><br>
                <label>考生总数：<input type="number" name="total" min="1" required value="${total}"></label><br><br>
                <label>补考考生：<input type="number" name="makeup" min="0" required value="${makeup}"></label><br><br>
                <label>初考考生：<input type="number" name="first" min="0" required value="${first}"></label><br><br>
                <label>实际参考：<input type="number" name="actual" min="0" required value="${actual}"></label><br><br>
                <label>缺考：<input type="number" name="absent" min="0" required value="${absent}"></label><br><br>
                <label>延期考生：<input type="number" name="delay" min="0" required value="${delay}"></label>
                </form>
            `, function() {
                const f = $('#settle-form');
                const date = f.find('input[name="date"]').val();
                const total = parseInt(f.find('input[name="total"]').val());
                const makeup = parseInt(f.find('input[name="makeup"]').val());
                const first = parseInt(f.find('input[name="first"]').val());
                const actual = parseInt(f.find('input[name="actual"]').val());
                const absent = parseInt(f.find('input[name="absent"]').val());
                const delay = parseInt(f.find('input[name="delay"]').val());
                if(!date || isNaN(total) || isNaN(makeup) || isNaN(first) || isNaN(actual) || isNaN(absent) || isNaN(delay)) {
                    showToast('请填写完整信息！'); return;
                }
                if(makeup + first !== total) {
                    showToast('补考+初考 必须等于 总数！'); return;
                }
                if(actual + absent + delay !== total) {
                    showToast('实际参考+缺考+延期 必须等于 总数！'); return;
                }
                const id = Date.now();
                settlementList.push({id, date, read: false, stat: {total, makeup, first, actual, absent, delay}});
                window.settleFilterDate = date;
                $('#main-content').html(getSettlementModuleHtml());
                bindSettlementModuleEvents();
                showToast('上报成功！');
            }, null, '上报');
        });
        // 查看详情
        $('.view-settle').on('click', function() {
            const id = $(this).data('idx');
            const item = settlementList.find(x=>x.id==id);
            if(item) item.read = true;
            showModal('日结算任务详情', `
                <div>日期：${item.date}</div>
                <div>编排总数：${item.stat.total}</div>
                <div>补考考生：${item.stat.makeup}</div>
                <div>初考考生：${item.stat.first}</div>
                <div>实际参考：${item.stat.actual}</div>
                <div>缺考：${item.stat.absent}</div>
                <div>延期考生：${item.stat.delay}</div>
            `, function() {
                $('#main-content').html(getSettlementModuleHtml());
                bindSettlementModuleEvents();
            }, null, '关闭');
        });
        // 标记已读
        $('.mark-read').on('click', function() {
            const id = $(this).data('idx');
            const item = settlementList.find(x=>x.id==id);
            if(item) item.read = true;
            $('#main-content').html(getSettlementModuleHtml());
            bindSettlementModuleEvents();
        });
        // 批量已读
        $('.batch-read').on('click', function() {
            settlementList.forEach(item=>{ if(!item.read) item.read=true; });
            $('#main-content').html(getSettlementModuleHtml());
            bindSettlementModuleEvents();
        });
    }

    // ====== 更新assign模块内容 ======
    function getAssignModuleHtml() {
        // 状态、机构筛选
        let filterStatus = window.assignFilterStatus || 'all';
        let filterOrg = window.assignFilterOrg || 'all';
        let filtered = assignList.filter(item =>
            (filterStatus==='all'||item.status===filterStatus) &&
            (filterOrg==='all'||item.org===filterOrg)
        );
        let html = `<div class="card">
            <h2>考评任务委派</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;flex-wrap:wrap;">
                <button class="add-assign" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">新增委派</button>
                <label>状态筛选：<select id="assign-status-filter">
                    <option value="all">全部</option>
                    <option value="doing">进行中</option>
                    <option value="done">已完成</option>
                    <option value="auto">自动备案</option>
                </select></label>
                <label>机构筛选：<select id="assign-org-filter">
                    <option value="all">全部</option>
                    ${orgs.map(o=>`<option value="${o}">${o}</option>`).join('')}
                </select></label>
                <label>分配方式：<button class="toggle-random" style="background:${assignSettings.random?'#52c41a':'#aaa'};color:#fff;border:none;border-radius:5px;padding:4px 14px;cursor:pointer;">${assignSettings.random?'随机':'手动'}</button></label>
                <button class="auto-assign" style="background:#faad14;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">模拟自动备案</button>
            </div>
            <table class="plan-table">
                <thead>
                    <tr><th>日期</th><th>机构</th><th>组长</th><th>考评员</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? '<tr><td colspan="6">暂无委派任务</td></tr>' : filtered.map((item, idx) => `
                        <tr>
                            <td>${item.date}</td>
                            <td>${item.org}</td>
                            <td>${item.leader.name}</td>
                            <td>${item.evaluators.map(e=>e.name).join('、')}</td>
                            <td>${getAssignStatusText(item.status)}</td>
                            <td>
                                <button class="view-assign" data-idx="${item.id}">详情</button>
                                ${item.status==='doing'?`<button class="edit-assign" data-idx="${item.id}">修改</button><button class="finish-assign" data-idx="${item.id}">完成</button>`:''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    function getAssignStatusText(status) {
        switch(status) {
            case 'doing': return '进行中';
            case 'done': return '已完成';
            case 'auto': return '自动备案';
            default: return '-';
        }
    }
    // ====== 绑定assign模块事件 ======
    function bindAssignModuleEvents() {
        // 状态筛选
        $('#assign-status-filter').val(window.assignFilterStatus||'all').on('change', function(){
            window.assignFilterStatus = $(this).val();
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
        });
        // 机构筛选
        $('#assign-org-filter').val(window.assignFilterOrg||'all').on('change', function(){
            window.assignFilterOrg = $(this).val();
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
        });
        // 分配方式切换
        $('.toggle-random').on('click', function(){
            assignSettings.random = !assignSettings.random;
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
        });
        // 新增委派
        $('.add-assign').on('click', function(){
            const today = new Date();
            const todayStr = today.getFullYear()+'-'+(today.getMonth()+1).toString().padStart(2,'0')+'-'+today.getDate().toString().padStart(2,'0');
            let leaderOptions = allEvaluators.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
            let evalOptions = allEvaluators.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');
            let orgOptions = orgs.map(o=>`<option value="${o}">${o}</option>`).join('');
            let evalSelect = assignSettings.random ? '<span style="color:#888;">系统将自动随机分配考评员</span>' : `<select name="evaluators" multiple size="4" style="width:120px;">${evalOptions}</select>`;
            showModal('新增委派任务', `
                <form id="assign-form">
                    <label>日期：<input type="date" name="date" value="${todayStr}" required></label><br><br>
                    <label>机构：<select name="org">${orgOptions}</select></label><br><br>
                    <label>考评组长：<select name="leader">${leaderOptions}</select></label><br><br>
                    <label>考评员：${evalSelect}</label><br><br>
                    <label>任务类型：<input type="text" name="type" value="技能考评" required></label>
                </form>
            `, function(){
                const f = $('#assign-form');
                const date = f.find('input[name="date"]').val();
                const org = f.find('select[name="org"]').val();
                const leaderId = f.find('select[name="leader"]').val();
                const leader = allEvaluators.find(e=>e.id===leaderId);
                let evaluators = [];
                if(assignSettings.random){
                    // 随机分配，组长不能兼职
                    const pool = allEvaluators.filter(e=>e.id!==leaderId);
                    const count = Math.floor(Math.random()*2)+2; // 2~3人
                    for(let i=0;i<count;i++){
                        let idx = Math.floor(Math.random()*pool.length);
                        evaluators.push(pool[idx]);
                        pool.splice(idx,1);
                    }
                }else{
                    const evalIds = f.find('select[name="evaluators"]').val()||[];
                    if(evalIds.includes(leaderId)){
                        showToast('组长不能兼职考评员！'); return;
                    }
                    evaluators = allEvaluators.filter(e=>evalIds.includes(e.id));
                }
                if(!date||!org||!leader||evaluators.length===0){
                    showToast('请填写完整信息并选择考评员！'); return;
                }
                const id = Date.now();
                assignList.push({id,date,org,leader,evaluators,type:f.find('input[name="type"]').val(),status:'doing',creator:'站长',createTime:nowTime()});
                $('#main-content').html(getAssignModuleHtml());
                bindAssignModuleEvents();
                showToast('委派成功！');
            }, null, '委派');
        });
        // 详情
        $('.view-assign').on('click', function(){
            const id = $(this).data('idx');
            const item = assignList.find(x=>x.id==id);
            let html = `<div>任务类型：${item.type}</div>
                <div>日期：${item.date}</div>
                <div>机构：${item.org}</div>
                <div>组长：${item.leader.name}</div>
                <div>考评员：${item.evaluators.map(e=>e.name).join('、')}</div>
                <div>状态：${getAssignStatusText(item.status)}</div>
                <div>创建人：${item.creator}</div>
                <div>创建时间：${item.createTime}</div>`;
            showModal('委派任务详情', html, null, null, '关闭');
        });
        // 修改
        $('.edit-assign').on('click', function(){
            const id = $(this).data('idx');
            const item = assignList.find(x=>x.id==id);
            let leaderOptions = allEvaluators.map(e=>`<option value="${e.id}"${e.id===item.leader.id?' selected':''}>${e.name}</option>`).join('');
            let evalOptions = allEvaluators.map(e=>`<option value="${e.id}"${item.evaluators.find(ev=>ev.id===e.id)?' selected':''}>${e.name}</option>`).join('');
            let evalSelect = assignSettings.random ? '<span style="color:#888;">系统将自动随机分配考评员</span>' : `<select name="evaluators" multiple size="4" style="width:120px;">${evalOptions}</select>`;
            showModal('修改委派任务', `
                <form id="assign-form">
                    <label>考评组长：<select name="leader">${leaderOptions}</select></label><br><br>
                    <label>考评员：${evalSelect}</label>
                </form>
            `, function(){
                const f = $('#assign-form');
                const leaderId = f.find('select[name="leader"]').val();
                const leader = allEvaluators.find(e=>e.id===leaderId);
                let evaluators = [];
                if(assignSettings.random){
                    const pool = allEvaluators.filter(e=>e.id!==leaderId);
                    const count = Math.floor(Math.random()*2)+2;
                    for(let i=0;i<count;i++){
                        let idx = Math.floor(Math.random()*pool.length);
                        evaluators.push(pool[idx]);
                        pool.splice(idx,1);
                    }
                }else{
                    const evalIds = f.find('select[name="evaluators"]').val()||[];
                    if(evalIds.includes(leaderId)){
                        showToast('组长不能兼职考评员！'); return;
                    }
                    evaluators = allEvaluators.filter(e=>evalIds.includes(e.id));
                }
                if(!leader||evaluators.length===0){
                    showToast('请填写完整信息并选择考评员！'); return;
                }
                item.leader = leader;
                item.evaluators = evaluators;
                $('#main-content').html(getAssignModuleHtml());
                bindAssignModuleEvents();
                showToast('修改成功！');
            }, null, '保存');
        });
        // 完成
        $('.finish-assign').on('click', function(){
            const id = $(this).data('idx');
            const item = assignList.find(x=>x.id==id);
            item.status = 'done';
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
            showToast('任务已完成并备案！');
        });
        // 模拟自动备案
        $('.auto-assign').on('click', function(){
            assignList.forEach(item=>{if(item.status==='doing')item.status='auto';});
            $('#main-content').html(getAssignModuleHtml());
            bindAssignModuleEvents();
            showToast('所有进行中任务已自动备案！');
        });
    }

    // ====== 更新device模块内容 ======
    function getDeviceModuleHtml() {
        let filterType = window.deviceFilterType || 'all';
        let filterOrg = window.deviceFilterOrg || 'all';
        let filterSite = window.deviceFilterSite || 'all';
        let filterRoom = window.deviceFilterRoom || 'all';
        let filterArea = window.deviceFilterArea || 'all';
        let searchCode = window.deviceSearchCode || '';
        let filtered = deviceList.filter(item =>
            (filterType==='all'||item.type===filterType) &&
            (filterOrg==='all'||item.org===filterOrg) &&
            (filterSite==='all'||item.site===filterSite) &&
            (filterRoom==='all'||item.room===filterRoom) &&
            (filterArea==='all'||item.area===filterArea) &&
            (searchCode===''||item.code.includes(searchCode))
        );
        let html = `<div class="card">
            <h2>设备标识管理</h2>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                <button class="import-device" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">批量导入</button>
                <button class="batch-enable" style="background:#52c41a;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">批量启用</button>
                <button class="batch-disable" style="background:#ff4d4f;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">批量停用</button>
                <label>类型：<select id="device-type-filter"><option value="all">全部</option>${deviceTypes.map(t=>`<option value="${t}">${t}</option>`).join('')}</select></label>
                <label>机构：<select id="device-org-filter"><option value="all">全部</option>${deviceOrgs.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></label>
                <label>考点：<select id="device-site-filter"><option value="all">全部</option>${deviceSites.map(s=>`<option value="${s}">${s}</option>`).join('')}</select></label>
                <label>考场：<select id="device-room-filter"><option value="all">全部</option>${deviceRooms.map(r=>`<option value="${r}">${r}</option>`).join('')}</select></label>
                <label>考区：<select id="device-area-filter"><option value="all">全部</option>${deviceAreas.map(a=>`<option value="${a}">${a}</option>`).join('')}</select></label>
                <label>标识码：<input type="text" id="device-code-search" value="${searchCode}" placeholder="输入标识码搜索" style="width:120px;"></label>
            </div>
            <table class="plan-table">
                <thead>
                    <tr><th>标识码</th><th>类型</th><th>机构</th><th>考点</th><th>考场</th><th>考区</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? '<tr><td colspan="8">暂无设备</td></tr>' : filtered.map((item, idx) => `
                        <tr>
                            <td>${item.code}</td>
                            <td>${item.type}</td>
                            <td>${item.org}</td>
                            <td>${item.site}</td>
                            <td>${item.room}</td>
                            <td>${item.area}</td>
                            <td>${item.enabled ? '启用' : '停用'}</td>
                            <td>
                                <button class="edit-device" data-idx="${item.id}">编辑</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    // ====== 绑定device模块事件 ======
    function bindDeviceModuleEvents() {
        // 筛选
        $('#device-type-filter').val(window.deviceFilterType||'all').on('change', function(){window.deviceFilterType=$(this).val();$('#main-content').html(getDeviceModuleHtml());bindDeviceModuleEvents();});
        $('#device-org-filter').val(window.deviceFilterOrg||'all').on('change', function(){window.deviceFilterOrg=$(this).val();$('#main-content').html(getDeviceModuleHtml());bindDeviceModuleEvents();});
        $('#device-site-filter').val(window.deviceFilterSite||'all').on('change', function(){window.deviceFilterSite=$(this).val();$('#main-content').html(getDeviceModuleHtml());bindDeviceModuleEvents();});
        $('#device-room-filter').val(window.deviceFilterRoom||'all').on('change', function(){window.deviceFilterRoom=$(this).val();$('#main-content').html(getDeviceModuleHtml());bindDeviceModuleEvents();});
        $('#device-area-filter').val(window.deviceFilterArea||'all').on('change', function(){window.deviceFilterArea=$(this).val();$('#main-content').html(getDeviceModuleHtml());bindDeviceModuleEvents();});
        $('#device-code-search').off('input').on('keypress', function(e){
            if(e.which === 13){
                window.deviceSearchCode=$(this).val();
                $('#main-content').html(getDeviceModuleHtml());
                bindDeviceModuleEvents();
            }
        }).on('blur', function(){
            window.deviceSearchCode=$(this).val();
            $('#main-content').html(getDeviceModuleHtml());
            bindDeviceModuleEvents();
        });
        // 批量导入
        $('.import-device').on('click', function(){
            showModal('批量导入设备', `<form id="import-form">
                <label>每行一个设备，格式：标识码,类型,机构,考点,考场,考区（支持中英文逗号）</label><br>
                <p style="color:#2d8cf0;margin:5px 0;">支持简写：机构可用A/B/C，考点/考场/考区可用数字1/2/3</p>
                <p style="color:#888;font-size:12px;margin:5px 0;">例如：DEV001,终端A,A,1,2,3 会自动转换为 DEV001,终端A,A机构,考点1,考场2,考区3</p>
                <textarea name="devices" rows="8" style="width:98%;"></textarea>
            </form>`, function(){
                const lines = $('#import-form textarea').val().split('\n').map(l=>l.trim()).filter(l=>l);
                if(lines.length===0){showToast('请输入设备信息！');return;}
                let existedCodes = new Set(deviceList.map(d=>d.code));
                let added = 0, skipped = 0;
                lines.forEach(line=>{
                    // 支持中英文逗号
                    const arr = line.replace(/，/g,',').split(',');
                    if(arr.length!==6) { skipped++; return; }
                    const code = arr[0];
                    if(existedCodes.has(code)) { skipped++; return; }
                    const id = Date.now()+Math.random();
                    
                    // 转换简写为完整名称
                    const type = arr[1];
                    const org = getFullName('org', arr[2]);
                    const site = getFullName('site', arr[3]);
                    const room = getFullName('room', arr[4]);
                    const area = getFullName('area', arr[5]);
                    
                    deviceList.push({id, code, type, org, site, room, area, enabled:true});
                    existedCodes.add(code);
                    added++;
                });
                $('#main-content').html(getDeviceModuleHtml());
                bindDeviceModuleEvents();
                if(added>0 && skipped===0) showToast('导入成功！');
                else if(added>0 && skipped>0) showToast(`成功导入${added}条，跳过${skipped}条（重复或格式错误）`);
                else showToast('无有效设备被导入，请检查格式或重复！');
            }, null, '导入');
        });
        // 批量启用
        $('.batch-enable').on('click', function(){
            let filterType = window.deviceFilterType || 'all';
            let filterOrg = window.deviceFilterOrg || 'all';
            let filterSite = window.deviceFilterSite || 'all';
            let filterRoom = window.deviceFilterRoom || 'all';
            let filterArea = window.deviceFilterArea || 'all';
            let searchCode = window.deviceSearchCode || '';
            deviceList.forEach(item=>{
                if((filterType==='all'||item.type===filterType)&&
                   (filterOrg==='all'||item.org===filterOrg)&&
                   (filterSite==='all'||item.site===filterSite)&&
                   (filterRoom==='all'||item.room===filterRoom)&&
                   (filterArea==='all'||item.area===filterArea)&&
                   (searchCode===''||item.code.includes(searchCode)))
                    item.enabled=true;
            });
            $('#main-content').html(getDeviceModuleHtml());
            bindDeviceModuleEvents();
            showToast('批量启用成功！');
        });
        // 批量停用
        $('.batch-disable').on('click', function(){
            let filterType = window.deviceFilterType || 'all';
            let filterOrg = window.deviceFilterOrg || 'all';
            let filterSite = window.deviceFilterSite || 'all';
            let filterRoom = window.deviceFilterRoom || 'all';
            let filterArea = window.deviceFilterArea || 'all';
            let searchCode = window.deviceSearchCode || '';
            deviceList.forEach(item=>{
                if((filterType==='all'||item.type===filterType)&&
                   (filterOrg==='all'||item.org===filterOrg)&&
                   (filterSite==='all'||item.site===filterSite)&&
                   (filterRoom==='all'||item.room===filterRoom)&&
                   (filterArea==='all'||item.area===filterArea)&&
                   (searchCode===''||item.code.includes(searchCode)))
                    item.enabled=false;
            });
            $('#main-content').html(getDeviceModuleHtml());
            bindDeviceModuleEvents();
            showToast('批量停用成功！');
        });
        // 编辑
        $('.edit-device').on('click', function(){
            const id = $(this).data('idx');
            const item = deviceList.find(x=>x.id==id);
            let typeOptions = deviceTypes.map(t=>`<option value="${t}"${t===item.type?' selected':''}>${t}</option>`).join('');
            let orgOptions = deviceOrgs.map(o=>`<option value="${o}"${o===item.org?' selected':''}>${o}</option>`).join('');
            let siteOptions = deviceSites.map(s=>`<option value="${s}"${s===item.site?' selected':''}>${s}</option>`).join('');
            let roomOptions = deviceRooms.map(r=>`<option value="${r}"${r===item.room?' selected':''}>${r}</option>`).join('');
            let areaOptions = deviceAreas.map(a=>`<option value="${a}"${a===item.area?' selected':''}>${a}</option>`).join('');
            
            // 获取简写值（如果有）
            const getShortCode = (fullName, type) => {
                for (const [code, name] of Object.entries(deviceMappings[type] || {})) {
                    if (name === fullName) return code;
                }
                return fullName;
            };
            
            const orgShort = getShortCode(item.org, 'org');
            const siteShort = getShortCode(item.site, 'site');
            const roomShort = getShortCode(item.room, 'room');
            const areaShort = getShortCode(item.area, 'area');
            
            showModal('编辑设备', `<form id="edit-device-form">
                <label>标识码：<input type="text" name="code" value="${item.code}" required></label><br><br>
                <label>类型：<select name="type">${typeOptions}</select></label><br><br>
                <label>机构：<input type="text" name="org" value="${orgShort}" placeholder="输入简写如A或完整名称" required></label>
                <span style="color:#888;font-size:12px;">当前值: ${item.org}</span><br><br>
                <label>考点：<input type="text" name="site" value="${siteShort}" placeholder="输入简写如1或完整名称" required></label>
                <span style="color:#888;font-size:12px;">当前值: ${item.site}</span><br><br>
                <label>考场：<input type="text" name="room" value="${roomShort}" placeholder="输入简写如1或完整名称" required></label>
                <span style="color:#888;font-size:12px;">当前值: ${item.room}</span><br><br>
                <label>考区：<input type="text" name="area" value="${areaShort}" placeholder="输入简写如1或完整名称" required></label>
                <span style="color:#888;font-size:12px;">当前值: ${item.area}</span><br><br>
                <label>状态：<select name="enabled"><option value="true"${item.enabled?' selected':''}>启用</option><option value="false"${!item.enabled?' selected':''}>停用</option></select></label>
            </form>`, function(){
                const f = $('#edit-device-form');
                const orgInput = f.find('input[name="org"]').val();
                const siteInput = f.find('input[name="site"]').val();
                const roomInput = f.find('input[name="room"]').val();
                const areaInput = f.find('input[name="area"]').val();
                
                item.code = f.find('input[name="code"]').val();
                item.type = f.find('select[name="type"]').val();
                item.org = getFullName('org', orgInput);
                item.site = getFullName('site', siteInput);
                item.room = getFullName('room', roomInput);
                item.area = getFullName('area', areaInput);
                item.enabled = f.find('select[name="enabled"]').val()==='true';
                
                $('#main-content').html(getDeviceModuleHtml());
                bindDeviceModuleEvents();
                showToast('保存成功！');
            }, null, '保存');
        });
    }

    // ====== 更新duration模块内容 ======
    function getDurationModuleHtml() {
        // 获取筛选条件
        let filterPlan = window.durationFilterPlan || 'all';
        let filterOrg = window.durationFilterOrg || 'all';
        let filterWarningTime = window.durationFilterWarningTime || 'all';
        let filterDuration = window.durationFilterDuration || 'all';
        let searchIdCard = window.durationSearchIdCard || '';
        
        // 筛选预警记录
        let filtered = durationWarningList.filter(item =>
            (filterPlan === 'all' || item.plan === filterPlan) &&
            (filterOrg === 'all' || item.org === filterOrg) &&
            (filterWarningTime === 'all' || (filterWarningTime === 'today' && isToday(item.warningTime)) ||
             (filterWarningTime === 'week' && isThisWeek(item.warningTime)) ||
             (filterWarningTime === 'month' && isThisMonth(item.warningTime))) &&
            (filterDuration === 'all' || 
             (filterDuration === 'lt10' && item.duration < 10) ||
             (filterDuration === '10to20' && item.duration >= 10 && item.duration < 20) ||
             (filterDuration === 'gt20' && item.duration >= 20)) &&
            (searchIdCard === '' || item.idCard.includes(searchIdCard))
        );
        
        // 预警设置
        let html = `<div class="card">
            <h2>考核时长预警</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <label>预警时长（分钟）：<input type="number" id="duration-warning" value="${durationWarningThreshold}" min="1">
                <button class="save-duration" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">保存预警</button>
                <button class="generate-warnings" style="background:#52c41a;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">生成模拟预警</button>
            </div>
            <div style="margin-top:18px;margin-bottom:18px;">
                <h3>当前预警设置</h3>
                <p>预警时长：<span id="current-duration-warning">${durationWarningThreshold}分钟</span></p>
                <p>说明：考生考核总时长（每个考区考试的总和）低于预警时长将被记录为预警</p>
            </div>
            
            <h3>预警记录</h3>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                <label>所属计划：
                    <select id="duration-plan-filter">
                        <option value="all">全部</option>
                        ${durationWarningPlans.map(p => `<option value="${p}"${p === filterPlan ? ' selected' : ''}>${p}</option>`).join('')}
                    </select>
                </label>
                <label>所属机构：
                    <select id="duration-org-filter">
                        <option value="all">全部</option>
                        ${deviceOrgs.map(o => `<option value="${o}"${o === filterOrg ? ' selected' : ''}>${o}</option>`).join('')}
                    </select>
                </label>
                <label>预警时间：
                    <select id="duration-warning-time-filter">
                        <option value="all">全部</option>
                        <option value="today"${filterWarningTime === 'today' ? ' selected' : ''}>今天</option>
                        <option value="week"${filterWarningTime === 'week' ? ' selected' : ''}>本周</option>
                        <option value="month"${filterWarningTime === 'month' ? ' selected' : ''}>本月</option>
                    </select>
                </label>
                <label>总时长：
                    <select id="duration-duration-filter">
                        <option value="all">全部</option>
                        <option value="lt10"${filterDuration === 'lt10' ? ' selected' : ''}>小于10分钟</option>
                        <option value="10to20"${filterDuration === '10to20' ? ' selected' : ''}>10-20分钟</option>
                        <option value="gt20"${filterDuration === 'gt20' ? ' selected' : ''}>大于20分钟</option>
                    </select>
                </label>
                <label>身份证：
                    <input type="text" id="duration-idcard-search" value="${searchIdCard}" placeholder="输入身份证搜索" style="width:150px;">
                </label>
                <button class="export-warnings" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">导出</button>
            </div>
            
            <table class="plan-table">
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>身份证</th>
                        <th>方向（级别）</th>
                        <th>所属机构</th>
                        <th>所属计划</th>
                        <th>考试日期</th>
                        <th>考试总时长</th>
                        <th>预警时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? '<tr><td colspan="9">暂无预警记录</td></tr>' : filtered.map((item, idx) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.idCard}</td>
                            <td>${item.direction}（${item.level}）</td>
                            <td>${item.org}</td>
                            <td>${item.plan}</td>
                            <td>${item.examDate}</td>
                            <td>${item.duration}分钟</td>
                            <td>${item.warningTime}</td>
                            <td>
                                <button class="view-warning-detail" data-idx="${item.id}">详情</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    // ====== 日期辅助函数 ======
    function isToday(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    function isThisWeek(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(lastDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        return date >= firstDay && date <= lastDay;
    }
    
    function isThisMonth(dateStr) {
        const today = new Date();
        const date = new Date(dateStr);
        return date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
    
    // 生成随机身份证号
    function generateRandomIdCard() {
        const prefix = ['110101', '310101', '440101', '510101', '330101'];
        const randomPrefix = prefix[Math.floor(Math.random() * prefix.length)];
        const randomBirth = (1980 + Math.floor(Math.random() * 20)).toString() +
                           ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2) +
                           ("0" + (Math.floor(Math.random() * 28) + 1)).slice(-2);
        const randomSuffix = ("0" + Math.floor(Math.random() * 100)).slice(-2);
        const randomLast = "0123456789X"[Math.floor(Math.random() * 11)];
        return randomPrefix + randomBirth + randomSuffix + randomLast;
    }
    
    // 生成当前时间字符串
    function getCurrentTimeString() {
        const now = new Date();
        return now.getFullYear() + '-' +
               ("0" + (now.getMonth() + 1)).slice(-2) + '-' +
               ("0" + now.getDate()).slice(-2) + ' ' +
               ("0" + now.getHours()).slice(-2) + ':' +
               ("0" + now.getMinutes()).slice(-2) + ':' +
               ("0" + now.getSeconds()).slice(-2);
    }
    
    // 生成随机日期字符串（最近30天内）
    function getRandomRecentDate() {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const randomDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        return randomDate.getFullYear() + '-' +
               ("0" + (randomDate.getMonth() + 1)).slice(-2) + '-' +
               ("0" + randomDate.getDate()).slice(-2);
    }
    
    // ====== 绑定duration模块事件 ======
    function bindDurationModuleEvents() {
        // 保存预警
        $('.save-duration').on('click', function() {
            const duration = $('#duration-warning').val();
            if(isNaN(duration) || parseInt(duration) < 1) {
                showToast('预警时长必须大于0！');
                return;
            }
            durationWarningThreshold = parseInt(duration);
            $('#current-duration-warning').text(`${duration}分钟`);
            showToast('预警时长已保存！');
        });
        
        // 生成模拟预警数据
        $('.generate-warnings').on('click', function() {
            // 清空现有数据
            durationWarningList = [];
            
            // 生成20条模拟数据
            for (let i = 0; i < 20; i++) {
                const name = studentNames[Math.floor(Math.random() * studentNames.length)];
                const idCard = generateRandomIdCard();
                const direction = studentDirections[Math.floor(Math.random() * studentDirections.length)];
                const level = studentLevels[Math.floor(Math.random() * studentLevels.length)];
                const org = deviceOrgs[Math.floor(Math.random() * deviceOrgs.length)];
                const plan = durationWarningPlans[Math.floor(Math.random() * durationWarningPlans.length)];
                const examDate = getRandomRecentDate();
                // 生成一个低于预警阈值的随机时长
                const duration = Math.max(1, Math.floor(Math.random() * durationWarningThreshold));
                const warningTime = getCurrentTimeString();
                const evaluator = evaluatorNames[Math.floor(Math.random() * evaluatorNames.length)];
                const evaluatorIdCard = generateRandomIdCard();
                
                durationWarningList.push({
                    id: Date.now() + i,
                    name,
                    idCard,
                    direction,
                    level,
                    org,
                    plan,
                    examDate,
                    duration,
                    warningTime,
                    evaluator,
                    evaluatorIdCard
                });
            }
            
            // 刷新界面
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
            showToast('已生成20条模拟预警数据！');
        });
        
        // 筛选 - 所属计划
        $('#duration-plan-filter').on('change', function() {
            window.durationFilterPlan = $(this).val();
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        });
        
        // 筛选 - 所属机构
        $('#duration-org-filter').on('change', function() {
            window.durationFilterOrg = $(this).val();
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        });
        
        // 筛选 - 预警时间
        $('#duration-warning-time-filter').on('change', function() {
            window.durationFilterWarningTime = $(this).val();
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        });
        
        // 筛选 - 总时长
        $('#duration-duration-filter').on('change', function() {
            window.durationFilterDuration = $(this).val();
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        });
        
        // 搜索 - 身份证
        $('#duration-idcard-search').off('input').on('keypress', function(e){
            if(e.which === 13){
                window.durationSearchIdCard=$(this).val();
                $('#main-content').html(getDurationModuleHtml());
                bindDurationModuleEvents();
            }
        }).on('blur', function(){
            window.durationSearchIdCard=$(this).val();
            $('#main-content').html(getDurationModuleHtml());
            bindDurationModuleEvents();
        });
        
        // 查看详情
        $('.view-warning-detail').on('click', function() {
            const id = $(this).data('idx');
            const item = durationWarningList.find(x => x.id == id);
            if (!item) {
                showToast('未找到预警记录！');
                return;
            }
            
            let html = `
                <div style="margin-bottom:15px;">
                    <h3 style="margin-bottom:10px;">考生信息</h3>
                    <p><strong>姓名：</strong>${item.name}</p>
                    <p><strong>身份证：</strong>${item.idCard}</p>
                    <p><strong>方向：</strong>${item.direction}</p>
                    <p><strong>级别：</strong>${item.level}</p>
                    <p><strong>所属机构：</strong>${item.org}</p>
                    <p><strong>所属计划：</strong>${item.plan}</p>
                </div>
                <div style="margin-bottom:15px;">
                    <h3 style="margin-bottom:10px;">考核信息</h3>
                    <p><strong>考试日期：</strong>${item.examDate}</p>
                    <p><strong>考试总时长：</strong>${item.duration}分钟</p>
                    <p><strong>预警时间：</strong>${item.warningTime}</p>
                    <p><strong>考评员：</strong>${item.evaluator}</p>
                    <p><strong>考评员身份证：</strong>${item.evaluatorIdCard}</p>
                </div>
                <div>
                    <h3 style="margin-bottom:10px;">预警原因</h3>
                    <p>考生考核总时长（${item.duration}分钟）低于预警阈值（${durationWarningThreshold}分钟）</p>
                </div>
            `;
            
            showModal('预警详情', html, null, null, '关闭');
        });
        
        // 导出预警记录
        $('.export-warnings').on('click', function() {
            // 获取筛选后的数据
            let filterPlan = window.durationFilterPlan || 'all';
            let filterOrg = window.durationFilterOrg || 'all';
            let filterWarningTime = window.durationFilterWarningTime || 'all';
            let filterDuration = window.durationFilterDuration || 'all';
            let searchIdCard = window.durationSearchIdCard || '';
            
            let filtered = durationWarningList.filter(item =>
                (filterPlan === 'all' || item.plan === filterPlan) &&
                (filterOrg === 'all' || item.org === filterOrg) &&
                (filterWarningTime === 'all' || (filterWarningTime === 'today' && isToday(item.warningTime)) ||
                 (filterWarningTime === 'week' && isThisWeek(item.warningTime)) ||
                 (filterWarningTime === 'month' && isThisMonth(item.warningTime))) &&
                (filterDuration === 'all' || 
                 (filterDuration === 'lt10' && item.duration < 10) ||
                 (filterDuration === '10to20' && item.duration >= 10 && item.duration < 20) ||
                 (filterDuration === 'gt20' && item.duration >= 20)) &&
                (searchIdCard === '' || item.idCard.includes(searchIdCard))
            );
            
            if (filtered.length === 0) {
                showToast('没有符合条件的预警记录可导出！');
                return;
            }
            
            // 创建CSV内容，规避Excel自动类型识别
            let csvContent = '\uFEFF'; // 添加UTF-8 BOM标记，解决Excel打开中文乱码问题
            csvContent += '姓名,身份证,所属计划,所属机构,方向,级别,考试日期,总时长,预警时间,考评员,考评员身份证\n';
            filtered.forEach(item => {
                csvContent += `${item.name},="${item.idCard}",${item.plan},${item.org},${item.direction},${item.level},="${item.examDate}",${item.duration}分钟,="${item.warningTime}",${item.evaluator},="${item.evaluatorIdCard}"\n`;
            });
            // 创建Blob对象并下载
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '考核时长预警.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(`已导出${filtered.length}条预警记录！`);
        });
    }

    // ====== 更新cross模块内容 ======
    function getCrossAreaModuleHtml() {
        // 获取筛选条件
        let filterOrg = window.crossFilterOrg || 'all';
        let filterWarningTime = window.crossFilterWarningTime || 'all';
        let filterEvalDate = window.crossFilterEvalDate || 'all';
        let searchIdCard = window.crossSearchIdCard || '';
        
        // 筛选预警记录
        let filtered = crossAreaWarningList.filter(item =>
            (filterOrg === 'all' || item.org === filterOrg) &&
            (filterWarningTime === 'all' || (filterWarningTime === 'today' && isToday(item.warningTime)) ||
             (filterWarningTime === 'week' && isThisWeek(item.warningTime)) ||
             (filterWarningTime === 'month' && isThisMonth(item.warningTime))) &&
            (filterEvalDate === 'all' || (filterEvalDate === 'today' && isToday(item.evalDate)) ||
             (filterEvalDate === 'week' && isThisWeek(item.evalDate)) ||
             (filterEvalDate === 'month' && isThisMonth(item.evalDate))) &&
            (searchIdCard === '' || item.idCard.includes(searchIdCard))
        );
        
        let html = `<div class="card">
            <h2>考评员单日跨区考评预警</h2>
            <div style="margin-top:18px;margin-bottom:18px;">
                <h3>预警说明</h3>
                <p>统计考评员同一天内存在多个考区考评的异常情况，如张三同一天内参与了A、B至少2区及以上的考区考评，包括不同考场下的考区，则系统提示预警</p>
            </div>
            
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <button class="generate-cross-warnings" style="background:#52c41a;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">生成模拟预警</button>
            </div>
            
            <h3>预警记录</h3>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                <label>所属机构：
                    <select id="cross-org-filter">
                        <option value="all">全部</option>
                        ${evaluatorOrgs.map(o => `<option value="${o}"${o === filterOrg ? ' selected' : ''}>${o}</option>`).join('')}
                    </select>
                </label>
                <label>预警时间：
                    <select id="cross-warning-time-filter">
                        <option value="all">全部</option>
                        <option value="today"${filterWarningTime === 'today' ? ' selected' : ''}>今天</option>
                        <option value="week"${filterWarningTime === 'week' ? ' selected' : ''}>本周</option>
                        <option value="month"${filterWarningTime === 'month' ? ' selected' : ''}>本月</option>
                    </select>
                </label>
                <label>考评时间：
                    <select id="cross-eval-date-filter">
                        <option value="all">全部</option>
                        <option value="today"${filterEvalDate === 'today' ? ' selected' : ''}>今天</option>
                        <option value="week"${filterEvalDate === 'week' ? ' selected' : ''}>本周</option>
                        <option value="month"${filterEvalDate === 'month' ? ' selected' : ''}>本月</option>
                    </select>
                </label>
                <label>身份证：
                    <input type="text" id="cross-idcard-search" value="${searchIdCard}" placeholder="输入身份证搜索" style="width:150px;">
                </label>
                <button class="export-cross-warnings" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">导出</button>
            </div>
            
            <table class="plan-table">
                <thead>
                    <tr>
                        <th>考评员姓名</th>
                        <th>身份证</th>
                        <th>参与考区数</th>
                        <th>参与考区名称</th>
                        <th>考评日期</th>
                        <th>预警时间</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.length === 0 ? '<tr><td colspan="7">暂无预警记录</td></tr>' : filtered.map((item, idx) => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.idCard}</td>
                            <td>${item.areaCount}</td>
                            <td>${item.areas.join(', ')}</td>
                            <td>${item.evalDate}</td>
                            <td>${item.warningTime}</td>
                            <td>
                                <button class="view-cross-detail" data-idx="${item.id}">详情</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>`;
         return html;
    }
    
    // ====== 绑定跨区考评预警模块事件 ======
    function bindCrossAreaModuleEvents() {
        // 生成模拟预警数据
        $('.generate-cross-warnings').on('click', function() {
            // 清空现有数据
            crossAreaWarningList = [];
            
            // 生成15条模拟数据
            for (let i = 0; i < 15; i++) {
                const evaluator = evaluatorList[Math.floor(Math.random() * evaluatorList.length)];
                const org = evaluatorOrgs[Math.floor(Math.random() * evaluatorOrgs.length)];
                const evalDate = getRandomRecentDate();
                
                // 随机生成2-4个考区
                const areaCount = Math.floor(Math.random() * 3) + 2; // 2到4个考区
                const areas = [];
                const areaDetails = [];
                
                // 确保考区不重复
                const availableAreas = [...examAreas];
                for (let j = 0; j < areaCount; j++) {
                    if (availableAreas.length === 0) break;
                    const randomIndex = Math.floor(Math.random() * availableAreas.length);
                    const area = availableAreas.splice(randomIndex, 1)[0];
                    areas.push(area);
                    
                    // 为每个考区添加1-3个考场
                    const roomCount = Math.floor(Math.random() * 3) + 1;
                    const rooms = [];
                    for (let k = 0; k < roomCount; k++) {
                        rooms.push(examRooms[Math.floor(Math.random() * examRooms.length)]);
                    }
                    
                    areaDetails.push({
                        area,
                        rooms,
                        startTime: `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                        endTime: `${Math.floor(Math.random() * 6) + 14}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
                    });
                }
                
                crossAreaWarningList.push({
                    id: Date.now() + i,
                    name: evaluator.name,
                    idCard: evaluator.idCard,
                    org,
                    areaCount,
                    areas,
                    areaDetails,
                    evalDate,
                    warningTime: getCurrentTimeString()
                });
            }
            
            // 刷新界面
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
            showToast('已生成15条模拟预警数据！');
        });
        
        // 筛选 - 所属机构
        $('#cross-org-filter').on('change', function() {
            window.crossFilterOrg = $(this).val();
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
        });
        
        // 筛选 - 预警时间
        $('#cross-warning-time-filter').on('change', function() {
            window.crossFilterWarningTime = $(this).val();
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
        });
        
        // 筛选 - 考评时间
        $('#cross-eval-date-filter').on('change', function() {
            window.crossFilterEvalDate = $(this).val();
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
        });
        
        // 搜索 - 身份证
        $('#cross-idcard-search').off('input').on('keypress', function(e){
            if(e.which === 13){
                window.crossSearchIdCard=$(this).val();
                $('#main-content').html(getCrossAreaModuleHtml());
                bindCrossAreaModuleEvents();
            }
        }).on('blur', function(){
            window.crossSearchIdCard=$(this).val();
            $('#main-content').html(getCrossAreaModuleHtml());
            bindCrossAreaModuleEvents();
        });
        
        // 查看详情
        $('.view-cross-detail').on('click', function() {
            const id = $(this).data('idx');
            const item = crossAreaWarningList.find(x => x.id == id);
            if (!item) {
                showToast('未找到预警记录！');
                return;
            }
            
            // 生成考区详情HTML
            let areaDetailsHtml = '';
            item.areaDetails.forEach(detail => {
                areaDetailsHtml += `
                    <div style="margin-bottom:10px;padding:10px;border:1px solid #eee;border-radius:5px;">
                        <p><strong>考区：</strong>${detail.area}</p>
                        <p><strong>考场：</strong>${detail.rooms.join(', ')}</p>
                        <p><strong>考评时间：</strong>${detail.startTime} - ${detail.endTime}</p>
                    </div>
                `;
            });
            
            showModal('预警详情', `
                <div style="margin-bottom:15px;">
                    <h3 style="margin-bottom:10px;">考评员信息</h3>
                    <p><strong>姓名：</strong>${item.name}</p>
                    <p><strong>身份证：</strong>${item.idCard}</p>
                    <p><strong>所属机构：</strong>${item.org}</p>
                </div>
                <div style="margin-bottom:15px;">
                    <h3 style="margin-bottom:10px;">考评信息</h3>
                    <p><strong>考评日期：</strong>${item.evalDate}</p>
                    <p><strong>参与考区数：</strong>${item.areaCount}</p>
                    <p><strong>预警时间：</strong>${item.warningTime}</p>
                </div>
                <div>
                    <h3 style="margin-bottom:10px;">考区详情</h3>
                    ${areaDetailsHtml}
                </div>
            `);
        });
        
        // 导出
        $('.export-cross-warnings').on('click', function() {
            if (crossAreaWarningList.length === 0) {
                showToast('暂无预警记录可导出！');
                return;
            }
            
            // 获取筛选条件
            let filterOrg = window.crossFilterOrg || 'all';
            let filterWarningTime = window.crossFilterWarningTime || 'all';
            let filterEvalDate = window.crossFilterEvalDate || 'all';
            let searchIdCard = window.crossSearchIdCard || '';
            
            // 筛选预警记录
            let filtered = crossAreaWarningList.filter(item =>
                (filterOrg === 'all' || item.org === filterOrg) &&
                (filterWarningTime === 'all' || (filterWarningTime === 'today' && isToday(item.warningTime)) ||
                 (filterWarningTime === 'week' && isThisWeek(item.warningTime)) ||
                 (filterWarningTime === 'month' && isThisMonth(item.warningTime))) &&
                (filterEvalDate === 'all' || (filterEvalDate === 'today' && isToday(item.evalDate)) ||
                 (filterEvalDate === 'week' && isThisWeek(item.evalDate)) ||
                 (filterEvalDate === 'month' && isThisMonth(item.evalDate))) &&
                (searchIdCard === '' || item.idCard.includes(searchIdCard))
            );
            
            if (filtered.length === 0) {
                showToast('筛选后无预警记录可导出！');
                return;
            }
            
            // 生成CSV内容
            // 添加UTF-8 BOM标记，解决Excel打开中文乱码问题
            let csvContent = '\uFEFF姓名,身份证,参与考区数,考评日期,预警时间\n';
            filtered.forEach(item => {
                csvContent += `${item.name},=\"${item.idCard}\",${item.areaCount},=\"${item.evalDate}\",=\"${item.warningTime}\"\n`;
            });
            
            // 创建下载链接
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `跨区考评预警记录_${getCurrentTimeString().replace(/[\s:]/g, '')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('导出成功！');
        });
    }

    // ====== 更新ban模块内容 ======
    function getBanModuleHtml() {
        // 获取筛选条件
        let filterStatus = window.banFilterStatus || 'all';
        let filterOrg = window.banFilterOrg || 'all';
        let searchIdCard = window.banSearchIdCard || '';
        
        // 如果禁考列表不存在，初始化一个空数组
        if (!window.banList) {
            window.banList = [];
        }
        
        // 筛选禁考记录
        let filtered = window.banList.filter(item =>
            (filterStatus === 'all' || item.status === filterStatus) &&
            (filterOrg === 'all' || item.org === filterOrg) &&
            (searchIdCard === '' || item.idCard.includes(searchIdCard))
        );
        
        let html = `<div class="card">
            <h2>禁考管理 - 考核作弊禁考</h2>
            
            <div style="margin-bottom:20px;">
                <button class="add-ban-record" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">新增禁考申请</button>
            </div>
            
            <div style="margin-bottom:20px;">
                <h3>禁考申请记录</h3>
                <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px;">
                    <label>状态：
                        <select id="ban-status-filter">
                            <option value="all">全部</option>
                            <option value="pending"${filterStatus === 'pending' ? ' selected' : ''}>待审核</option>
                            <option value="approved"${filterStatus === 'approved' ? ' selected' : ''}>已通过</option>
                            <option value="rejected"${filterStatus === 'rejected' ? ' selected' : ''}>已驳回</option>
                        </select>
                    </label>
                    <label>所属机构：
                        <select id="ban-org-filter">
                            <option value="all">全部</option>
                            ${deviceOrgs.map(o => `<option value="${o}"${o === filterOrg ? ' selected' : ''}>${o}</option>`).join('')}
                        </select>
                    </label>
                    <label>身份证：
                        <input type="text" id="ban-idcard-search" value="${searchIdCard}" placeholder="输入身份证搜索" style="width:150px;">
                    </label>
                    <button class="search-ban" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">搜索</button>
                </div>
                
                <table class="plan-table">
                    <thead>
                        <tr>
                            <th>姓名</th>
                            <th>身份证</th>
                            <th>所属机构</th>
                            <th>考试计划</th>
                            <th>作弊类型</th>
                            <th>申请时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filtered.length === 0 ? '<tr><td colspan="8">暂无禁考申请记录</td></tr>' : filtered.map((item, idx) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.idCard}</td>
                                <td>${item.org}</td>
                                <td>${item.plan}</td>
                                <td>${item.cheatingType}</td>
                                <td>${item.applyTime}</td>
                                <td>
                                    ${item.status === 'pending' ? '<span style="color:#ff9900;">待审核</span>' : 
                                      item.status === 'approved' ? '<span style="color:#52c41a;">已通过</span>' : 
                                      '<span style="color:#f5222d;">已驳回</span>'}
                                </td>
                                <td>
                                    <button class="view-ban-detail" data-idx="${item.id}">详情</button>
                                    ${item.status === 'pending' ? `
                                        <button class="approve-ban" data-idx="${item.id}">通过</button>
                                        <button class="reject-ban" data-idx="${item.id}">驳回</button>
                                    ` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
        return html;
    }
    // ====== 绑定ban模块事件 ======
    function bindBanModuleEvents() {
        // 初始化禁考列表（如果不存在）
        if (!window.banList) {
            window.banList = [];
        }
        
        // 状态筛选
        $('#ban-status-filter').on('change', function() {
            window.banFilterStatus = $(this).val();
            $('#main-content').html(getBanModuleHtml());
            bindBanModuleEvents();
        });
        
        // 机构筛选
        $('#ban-org-filter').on('change', function() {
            window.banFilterOrg = $(this).val();
            $('#main-content').html(getBanModuleHtml());
            bindBanModuleEvents();
        });
        
        // 身份证搜索
        $('#ban-idcard-search').on('keypress', function(e) {
            if (e.which === 13) {
                window.banSearchIdCard = $(this).val();
                $('#main-content').html(getBanModuleHtml());
                bindBanModuleEvents();
            }
        });
        
        // 搜索按钮
        $('.search-ban').on('click', function() {
            window.banSearchIdCard = $('#ban-idcard-search').val();
            $('#main-content').html(getBanModuleHtml());
            bindBanModuleEvents();
        });
        
        // 新增禁考申请
        $('.add-ban-record').on('click', function() {
            // 获取所有计划名称
            const planOptions = durationWarningPlans.map(p => `<option value="${p}">${p}</option>`).join('');
            
            // 作弊类型选项
            const cheatingTypes = ['代考', '夹带资料', '使用通讯设备', '抄袭他人', '其他作弊行为'];
            const cheatingOptions = cheatingTypes.map(t => `<option value="${t}">${t}</option>`).join('');
            
            // 机构选项
            const orgOptions = deviceOrgs.map(o => `<option value="${o}">${o}</option>`).join('');
            
            showModal('新增禁考申请', `<form id="add-ban-form">
                <div style="margin-bottom:15px;">
                    <h3>考生基本信息</h3>
                    <label>姓名：<input type="text" name="name" required></label><br><br>
                    <label>身份证：<input type="text" name="idCard" required pattern="[0-9Xx]{18}"></label><br><br>
                    <label>所属机构：<select name="org" required>${orgOptions}</select></label><br><br>
                    <label>考试计划：<select name="plan" required>${planOptions}</select></label><br><br>
                </div>
                
                <div style="margin-bottom:15px;">
                    <h3>作弊信息</h3>
                    <label>作弊类型：<select name="cheatingType" required>${cheatingOptions}</select></label><br><br>
                    <label>作弊描述：<textarea name="description" rows="4" style="width:98%;" required></textarea></label><br><br>
                    <label>佐证材料：<input type="file" name="evidence" accept="image/*,.pdf" multiple></label>
                    <p style="color:#888;font-size:12px;">支持上传图片或PDF文件作为佐证材料</p>
                </div>
                
                <div>
                    <h3>处理建议</h3>
                    <label><input type="checkbox" name="cancelScore" checked> 取消成绩</label><br>
                    <label><input type="checkbox" name="cancelCertificate" checked> 取消证书编号</label><br>
                    <label><input type="checkbox" name="banFuture" checked> 禁止参加后续考试</label><br>
                    <label>禁考期限：
                        <select name="banPeriod">
                            <option value="6">6个月</option>
                            <option value="12" selected>12个月</option>
                            <option value="24">24个月</option>
                            <option value="forever">永久禁考</option>
                        </select>
                    </label>
                </div>
            </form>`, function() {
                const form = $('#add-ban-form');
                const name = form.find('input[name="name"]').val().trim();
                const idCard = form.find('input[name="idCard"]').val().trim();
                const org = form.find('select[name="org"]').val();
                const plan = form.find('select[name="plan"]').val();
                const cheatingType = form.find('select[name="cheatingType"]').val();
                const description = form.find('textarea[name="description"]').val().trim();
                const cancelScore = form.find('input[name="cancelScore"]').prop('checked');
                const cancelCertificate = form.find('input[name="cancelCertificate"]').prop('checked');
                const banFuture = form.find('input[name="banFuture"]').prop('checked');
                const banPeriod = form.find('select[name="banPeriod"]').val();
                
                // 验证表单
                if (!name || !idCard || !org || !plan || !cheatingType || !description) {
                    showToast('请填写完整信息！');
                    return false;
                }
                
                // 验证身份证格式
                if (!/^[0-9Xx]{18}$/.test(idCard)) {
                    showToast('身份证格式不正确！');
                    return false;
                }
                
                // 创建新的禁考记录
                const newBan = {
                    id: window.banList.length > 0 ? Math.max(...window.banList.map(item => item.id)) + 1 : 1,
                    name,
                    idCard,
                    org,
                    plan,
                    cheatingType,
                    description,
                    cancelScore,
                    cancelCertificate,
                    banFuture,
                    banPeriod,
                    status: 'pending',
                    applyTime: getCurrentTimeString(),
                    evidence: '已上传佐证材料',
                    applyUser: '当前用户',
                    approveUser: '',
                    approveTime: '',
                    rejectReason: ''
                };
                
                window.banList.push(newBan);
                $('#main-content').html(getBanModuleHtml());
                bindBanModuleEvents();
                showToast('禁考申请已提交，等待审核！');
            }, null, '提交申请');
        });
        
        // 查看详情
        $('.view-ban-detail').on('click', function() {
            const id = $(this).data('idx');
            const item = window.banList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            let statusHtml = '';
            if (item.status === 'pending') {
                statusHtml = '<span style="color:#ff9900;">待审核</span>';
            } else if (item.status === 'approved') {
                statusHtml = `<span style="color:#52c41a;">已通过</span><br>
                              <span>审核人：${item.approveUser}</span><br>
                              <span>审核时间：${item.approveTime}</span>`;
            } else {
                statusHtml = `<span style="color:#f5222d;">已驳回</span><br>
                              <span>审核人：${item.approveUser}</span><br>
                              <span>审核时间：${item.approveTime}</span><br>
                              <span>驳回原因：${item.rejectReason}</span>`;
            }
            
            showModal('禁考申请详情', `
                <div style="margin-bottom:15px;">
                    <h3>考生基本信息</h3>
                    <p><strong>姓名：</strong>${item.name}</p>
                    <p><strong>身份证：</strong>${item.idCard}</p>
                    <p><strong>所属机构：</strong>${item.org}</p>
                    <p><strong>考试计划：</strong>${item.plan}</p>
                </div>
                
                <div style="margin-bottom:15px;">
                    <h3>作弊信息</h3>
                    <p><strong>作弊类型：</strong>${item.cheatingType}</p>
                    <p><strong>作弊描述：</strong>${item.description}</p>
                    <p><strong>佐证材料：</strong>${item.evidence}</p>
                </div>
                
                <div style="margin-bottom:15px;">
                    <h3>处理建议</h3>
                    <p><strong>取消成绩：</strong>${item.cancelScore ? '是' : '否'}</p>
                    <p><strong>取消证书编号：</strong>${item.cancelCertificate ? '是' : '否'}</p>
                    <p><strong>禁止参加后续考试：</strong>${item.banFuture ? '是' : '否'}</p>
                    <p><strong>禁考期限：</strong>${item.banPeriod === 'forever' ? '永久禁考' : item.banPeriod + '个月'}</p>
                </div>
                
                <div>
                    <h3>申请信息</h3>
                    <p><strong>申请人：</strong>${item.applyUser}</p>
                    <p><strong>申请时间：</strong>${item.applyTime}</p>
                    <p><strong>状态：</strong>${statusHtml}</p>
                </div>
            `);
        });
        
        // 通过申请
        $('.approve-ban').on('click', function() {
            const id = $(this).data('idx');
            const item = window.banList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            showModal('审核通过', `
                <p>您确定要通过此禁考申请吗？</p>
                <p>通过后将执行以下操作：</p>
                <ul>
                    ${item.cancelScore ? '<li>取消该考生成绩</li>' : ''}
                    ${item.cancelCertificate ? '<li>取消该考生证书编号</li>' : ''}
                    ${item.banFuture ? `<li>禁止该考生参加后续考试（${item.banPeriod === 'forever' ? '永久禁考' : item.banPeriod + '个月'}）</li>` : ''}
                </ul>
                <p>请输入审核意见：</p>
                <textarea id="approve-comment" rows="3" style="width:98%;"></textarea>
            `, function() {
                item.status = 'approved';
                item.approveUser = '当前审核员';
                item.approveTime = getCurrentTimeString();
                item.approveComment = $('#approve-comment').val();
                
                $('#main-content').html(getBanModuleHtml());
                bindBanModuleEvents();
                showToast('禁考申请已通过！');
            }, null, '确认通过');
        });
        
        // 驳回申请
        $('.reject-ban').on('click', function() {
            const id = $(this).data('idx');
            const item = window.banList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            showModal('驳回申请', `
                <p>您确定要驳回此禁考申请吗？</p>
                <p>请输入驳回原因：</p>
                <textarea id="reject-reason" rows="3" style="width:98%;" required></textarea>
            `, function() {
                const rejectReason = $('#reject-reason').val().trim();
                if (!rejectReason) {
                    showToast('请输入驳回原因！');
                    return false;
                }
                
                item.status = 'rejected';
                item.approveUser = '当前审核员';
                item.approveTime = getCurrentTimeString();
                item.rejectReason = rejectReason;
                
                $('#main-content').html(getBanModuleHtml());
                bindBanModuleEvents();
                showToast('禁考申请已驳回！');
            }, null, '确认驳回');
        });
    }

    // ====== 更新edit模块内容 ======
    function getEditModuleHtml() {
        // 筛选考生信息修改申请
        const statusFilter = $('#edit-status-filter').val() || 'all';
        const orgFilter = $('#edit-org-filter').val() || 'all';
        const idCardSearch = $('#edit-idcard-search').val() || '';
        
        // 过滤数据
        let filteredEditList = studentEditList.filter(item => {
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;
            if (orgFilter !== 'all' && item.org !== orgFilter) return false;
            if (idCardSearch && !item.studentIdCard.includes(idCardSearch)) return false;
            return true;
        });
        
        // 权限设置
        let html = `<div class="card">
            <h2>考生信息修改管理</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <label>是否允许修改：<select id="allow-edit">
                    <option value="true">允许</option>
                    <option value="false">不允许</option>
                </select></label>
                <button class="save-edit" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">保存权限</button>
            </div>
            <div style="margin-top:18px;">
                <h3>当前权限设置</h3>
                <p>是否允许修改：<span id="current-edit-permission">${$('#allow-edit').val()==='true'?'允许':'不允许'}</span></p>
            </div>
        </div>
        
        <div class="card" style="margin-top:20px;">
            <h2>考生信息修改申请</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <button class="add-edit-request" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">新增修改申请</button>
            </div>
            
            <div style="margin-bottom:20px;display:flex;flex-wrap:wrap;gap:15px;">
                <div>
                    <label>状态筛选：</label>
                    <select id="edit-status-filter">
                        <option value="all">全部</option>
                        <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>待审核</option>
                        <option value="approved" ${statusFilter === 'approved' ? 'selected' : ''}>已通过</option>
                        <option value="rejected" ${statusFilter === 'rejected' ? 'selected' : ''}>已驳回</option>
                    </select>
                </div>
                <div>
                    <label>所属机构：</label>
                    <select id="edit-org-filter">
                        <option value="all">全部</option>
                        ${deviceOrgs.map(org => `<option value="${org}" ${orgFilter === org ? 'selected' : ''}>${org}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label>考生身份证：</label>
                    <input type="text" id="edit-idcard-search" placeholder="请输入身份证号" value="${idCardSearch}" style="width:180px;">
                </div>
                <div>
                    <button class="search-edit" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 12px;font-size:14px;cursor:pointer;">搜索</button>
                </div>
            </div>
            
            <table class="data-table" style="width:100%;border-collapse:collapse;margin-top:10px;">
                <thead>
                    <tr style="background:#f5f5f5;">
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">考生姓名</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">身份证号</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">所属机构</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">考试计划</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">修改类型</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">申请时间</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">状态</th>
                        <th style="padding:10px;text-align:left;border:1px solid #ddd;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredEditList.length > 0 ? filteredEditList.map(item => `
                        <tr>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.studentName}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.studentIdCard}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.org}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.plan}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.modifyType}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.applyTime}</td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">
                                <span style="padding:3px 8px;border-radius:3px;font-size:12px;${item.status === 'pending' ? 'background:#e6f7ff;color:#1890ff;' : item.status === 'approved' ? 'background:#f6ffed;color:#52c41a;' : 'background:#fff1f0;color:#f5222d;'}">                                
                                    ${item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已驳回'}
                                </span>
                            </td>
                            <td style="padding:10px;text-align:left;border:1px solid #ddd;">
                                <button class="view-edit" data-idx="${item.id}" style="background:#2d8cf0;color:#fff;border:none;border-radius:3px;padding:3px 8px;font-size:12px;cursor:pointer;margin-right:5px;">查看</button>
                                ${item.status === 'pending' ? `
                                    <button class="approve-edit" data-idx="${item.id}" style="background:#52c41a;color:#fff;border:none;border-radius:3px;padding:3px 8px;font-size:12px;cursor:pointer;margin-right:5px;">通过</button>
                                    <button class="reject-edit" data-idx="${item.id}" style="background:#f5222d;color:#fff;border:none;border-radius:3px;padding:3px 8px;font-size:12px;cursor:pointer;">驳回</button>
                                ` : ''}
                            </td>
                        </tr>
                    `).join('') : `
                        <tr>
                            <td colspan="8" style="padding:10px;text-align:center;border:1px solid #ddd;">暂无数据</td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>`;
        return html;
    }
    // ====== 绑定edit模块事件 ======
    function bindEditModuleEvents() {
        // 保存权限
        $('.save-edit').on('click', function() {
            const allowEdit = $('#allow-edit').val();
            $('#current-edit-permission').text(allowEdit==='true'?'允许':'不允许');
            showToast('权限已保存！');
        });
        
        // 状态筛选
        $('#edit-status-filter').on('change', function() {
            $('#main-content').html(getEditModuleHtml());
            bindEditModuleEvents();
        });
        
        // 机构筛选
        $('#edit-org-filter').on('change', function() {
            $('#main-content').html(getEditModuleHtml());
            bindEditModuleEvents();
        });
        
        // 身份证搜索
        $('.search-edit').on('click', function() {
            $('#main-content').html(getEditModuleHtml());
            bindEditModuleEvents();
        });
        
        // 新增修改申请
        $('.add-edit-request').on('click', function() {
            if ($('#allow-edit').val() !== 'true') {
                showToast('当前不允许修改考生信息！');
                return;
            }
            
            // 获取审核通过的考生列表
            const approvedStudents = studentList.filter(s => s.status === 'approved');
            if (approvedStudents.length === 0) {
                showToast('暂无审核通过的考生信息可修改！');
                return;
            }
            
            // 构建考生选择下拉框选项
            const studentOptions = approvedStudents.map(s => 
                `<option value="${s.id}">${s.name} (${s.idCard})</option>`
            ).join('');
            
            showModal('新增考生信息修改申请', `
                <div style="margin-bottom:15px;">
                    <h3>考生基本信息</h3>
                    <div style="margin-bottom:10px;">
                        <label>选择考生：</label>
                        <select id="edit-student-select" style="width:250px;">
                            ${studentOptions}
                        </select>
                    </div>
                    <div id="student-info" style="background:#f5f5f5;padding:10px;border-radius:5px;margin-top:10px;">
                        <p>请选择考生查看详细信息</p>
                    </div>
                </div>
                
                <div style="margin-bottom:15px;">
                    <h3>修改信息</h3>
                    <div style="margin-bottom:10px;">
                        <label>修改类型：</label>
                        <select id="edit-type-select" style="width:150px;">
                            <option value="姓名">姓名</option>
                            <option value="身份证号">身份证号</option>
                            <option value="照片">照片</option>
                        </select>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>原值：</label>
                        <input type="text" id="edit-old-value" style="width:250px;" readonly>
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>新值：</label>
                        <input type="text" id="edit-new-value" style="width:250px;">
                    </div>
                    <div style="margin-bottom:10px;">
                        <label>修改原因：</label>
                        <textarea id="edit-reason" rows="3" style="width:98%;"></textarea>
                    </div>
                </div>
                
                <div>
                    <h3>佐证材料</h3>
                    <div style="margin-bottom:10px;">
                        <label>上传佐证材料：</label>
                        <input type="file" id="edit-evidence">
                    </div>
                    <p style="color:#ff4d4f;font-size:12px;">注意：必须上传佐证材料，否则无法提交申请！</p>
                </div>
            `, function() {
                const studentId = $('#edit-student-select').val();
                const modifyType = $('#edit-type-select').val();
                const oldValue = $('#edit-old-value').val();
                const newValue = $('#edit-new-value').val();
                const reason = $('#edit-reason').val().trim();
                const evidence = $('#edit-evidence').val();
                
                if (!studentId) {
                    showToast('请选择考生！');
                    return false;
                }
                if (!modifyType) {
                    showToast('请选择修改类型！');
                    return false;
                }
                if (!newValue) {
                    showToast('请输入新值！');
                    return false;
                }
                if (!reason) {
                    showToast('请输入修改原因！');
                    return false;
                }
                if (!evidence) {
                    showToast('请上传佐证材料！');
                    return false;
                }
                
                // 获取选中的考生信息
                const student = studentList.find(s => s.id == studentId);
                if (!student) {
                    showToast('未找到考生信息！');
                    return false;
                }
                
                // 创建新的修改申请
                const newEditRequest = {
                    id: studentEditList.length > 0 ? Math.max(...studentEditList.map(item => item.id)) + 1 : 1,
                    studentId: student.id,
                    studentName: student.name,
                    studentIdCard: student.idCard,
                    org: student.org,
                    plan: student.plan,
                    modifyType: modifyType,
                    oldValue: oldValue,
                    newValue: newValue,
                    reason: reason,
                    evidence: '已上传佐证材料',
                    applyTime: getCurrentTimeString(),
                    applyUser: '当前工作人员',
                    status: 'pending',
                    approveUser: '',
                    approveTime: '',
                    rejectReason: ''
                };
                
                // 添加到修改申请列表
                studentEditList.push(newEditRequest);
                
                // 刷新页面
                $('#main-content').html(getEditModuleHtml());
                bindEditModuleEvents();
                showToast('修改申请已提交！');
            }, null, '提交申请');
            
            // 选择考生时更新信息
            $(document).on('change', '#edit-student-select', function() {
                const studentId = $(this).val();
                const student = studentList.find(s => s.id == studentId);
                if (student) {
                    $('#student-info').html(`
                        <p><strong>姓名：</strong>${student.name}</p>
                        <p><strong>身份证：</strong>${student.idCard}</p>
                        <p><strong>所属机构：</strong>${student.org}</p>
                        <p><strong>考试计划：</strong>${student.plan}</p>
                        <p><strong>方向：</strong>${student.direction}</p>
                        <p><strong>级别：</strong>${student.level}</p>
                    `);
                    
                    // 根据修改类型设置原值
                    updateOldValue();
                }
            });
            
            // 修改类型变化时更新原值
            $(document).on('change', '#edit-type-select', function() {
                updateOldValue();
            });
            
            // 更新原值函数
            function updateOldValue() {
                const studentId = $('#edit-student-select').val();
                const modifyType = $('#edit-type-select').val();
                const student = studentList.find(s => s.id == studentId);
                
                if (student && modifyType) {
                    let oldValue = '';
                    switch(modifyType) {
                        case '姓名':
                            oldValue = student.name;
                            break;
                        case '身份证号':
                            oldValue = student.idCard;
                            break;
                        case '照片':
                            oldValue = '原照片';
                            break;
                    }
                    $('#edit-old-value').val(oldValue);
                }
            }
            
            // 触发一次考生选择变化，初始化信息
            if (approvedStudents.length > 0) {
                setTimeout(() => {
                    $('#edit-student-select').trigger('change');
                }, 100);
            }
        });
        
        // 查看详情
        $('.view-edit').on('click', function() {
            const id = $(this).data('idx');
            const item = studentEditList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            showModal('查看修改申请详情', `
                <div style="margin-bottom:15px;">
                    <h3>考生基本信息</h3>
                    <p><strong>姓名：</strong>${item.studentName}</p>
                    <p><strong>身份证：</strong>${item.studentIdCard}</p>
                    <p><strong>所属机构：</strong>${item.org}</p>
                    <p><strong>考试计划：</strong>${item.plan}</p>
                </div>
                
                <div style="margin-bottom:15px;">
                    <h3>修改信息</h3>
                    <p><strong>修改类型：</strong>${item.modifyType}</p>
                    <p><strong>原值：</strong>${item.oldValue}</p>
                    <p><strong>新值：</strong>${item.newValue}</p>
                    <p><strong>修改原因：</strong>${item.reason}</p>
                    <p><strong>佐证材料：</strong>${item.evidence}</p>
                    <p><strong>申请时间：</strong>${item.applyTime}</p>
                    <p><strong>申请人：</strong>${item.applyUser}</p>
                </div>
                
                <div>
                    <h3>审核信息</h3>
                    <p><strong>状态：</strong>${item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : '已驳回'}</p>
                    ${item.status !== 'pending' ? `
                        <p><strong>审核人：</strong>${item.approveUser}</p>
                        <p><strong>审核时间：</strong>${item.approveTime}</p>
                        ${item.status === 'rejected' ? `<p><strong>驳回原因：</strong>${item.rejectReason}</p>` : ''}
                    ` : ''}
                </div>
            `);
        });
        
        // 通过申请
        $('.approve-edit').on('click', function() {
            const id = $(this).data('idx');
            const item = studentEditList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            showModal('通过申请', `
                <p>您确定要通过此修改申请吗？</p>
                <p>通过后将修改考生的相关信息。</p>
                <p>请输入审核意见：</p>
                <textarea id="approve-comment" rows="3" style="width:98%;"></textarea>
            `, function() {
                const approveComment = $('#approve-comment').val().trim();
                if (!approveComment) {
                    showToast('请输入审核意见！');
                    return false;
                }
                
                // 更新申请状态
                item.status = 'approved';
                item.approveUser = '当前审核员';
                item.approveTime = getCurrentTimeString();
                item.approveComment = approveComment;
                
                // 更新考生信息
                const student = studentList.find(s => s.id == item.studentId);
                if (student) {
                    switch(item.modifyType) {
                        case '姓名':
                            student.name = item.newValue;
                            break;
                        case '身份证号':
                            student.idCard = item.newValue;
                            break;
                        case '照片':
                            student.photo = '已更新';
                            break;
                    }
                }
                
                // 刷新页面
                $('#main-content').html(getEditModuleHtml());
                bindEditModuleEvents();
                showToast('修改申请已通过！');
            }, null, '确认通过');
        });
        
        // 驳回申请
        $('.reject-edit').on('click', function() {
            const id = $(this).data('idx');
            const item = studentEditList.find(x => x.id == id);
            
            if (!item) {
                showToast('未找到该记录！');
                return;
            }
            
            showModal('驳回申请', `
                <p>您确定要驳回此修改申请吗？</p>
                <p>请输入驳回原因：</p>
                <textarea id="reject-reason" rows="3" style="width:98%;" required></textarea>
            `, function() {
                const rejectReason = $('#reject-reason').val().trim();
                if (!rejectReason) {
                    showToast('请输入驳回原因！');
                    return false;
                }
                
                // 更新申请状态
                item.status = 'rejected';
                item.approveUser = '当前审核员';
                item.approveTime = getCurrentTimeString();
                item.rejectReason = rejectReason;
                
                // 刷新页面
                $('#main-content').html(getEditModuleHtml());
                bindEditModuleEvents();
                showToast('修改申请已驳回！');
            }, null, '确认驳回');
        });
    }
    
    // 获取当前时间字符串
    function getCurrentTimeString() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // ====== 更新audit模块内容 ======
    function getAuditModuleHtml() {
        // 标签数据（可持久化到localStorage）
        let defaultTags = ["证件照片模糊","信息不符","资料不全","证件过期","资料齐全无问题"];
        let customTags = JSON.parse(localStorage.getItem('customAuditTags')||'[]');
        let tags = [...defaultTags, ...customTags];
        let tagHtml = tags.map(t=>`<span class=\"audit-tag\" style=\"display:inline-block;background:#f0f0f0;border-radius:3px;padding:2px 8px;margin:2px;cursor:pointer;\">${t}${customTags.includes(t)?`<span class=\"del-tag\" style=\"color:#f5222d;margin-left:4px;cursor:pointer;\">×</span>`:''}</span>`).join('');

        // 使用全局 studentList
        let html = `<div class=\"card\">
            <h2>资料审核优化</h2>
            <div style=\"margin-top:0;margin-bottom:24px;\">
                <h3>待审核考生资料</h3>
                <table style=\"width:100%;border-collapse:collapse;text-align:center;\">
                    <thead>
                        <tr style=\"background-color:#f5f5f5;\">
                            <th style=\"padding:8px;border:1px solid #ddd;\">姓名</th>
                            <th style=\"padding:8px;border:1px solid #ddd;\">身份证号</th>
                            <th style=\"padding:8px;border:1px solid #ddd;\">照片</th>
                            <th style=\"padding:8px;border:1px solid #ddd;\">状态</th>
                            <th style=\"padding:8px;border:1px solid #ddd;\">审核原因</th>
                            <th style=\"padding:8px;border:1px solid #ddd;\">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentList.map(s => `
                        <tr data-student-id=\"${s.id}\">
                            <td style=\"padding:8px;border:1px solid #ddd;\">${s.name}</td>
                            <td style=\"padding:8px;border:1px solid #ddd;\">${s.idCard}</td>
                            <td style=\"padding:8px;border:1px solid #ddd;\"><img src=\"${s.photo}\" style=\"width:50px;height:50px;\"/></td>
                            <td style=\"padding:8px;border:1px solid #ddd;\">${s.status === 'pass' ? '已通过' : s.status === 'reject' ? '已驳回' : ''}</td>
                            <td style=\"padding:8px;border:1px solid #ddd;\">
                                <div class=\"student-reason\" data-id=\"${s.id}\">${s.reason || '请选择原因'}</div>
                            </td>
                            <td style=\"padding:8px;border:1px solid #ddd;\">
                                <button class=\"audit-pass\" data-id=\"${s.id}\" style=\"margin-right:5px;background:#52c41a;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;\">通过</button>
                                <button class=\"audit-reject\" data-id=\"${s.id}\" style=\"background:#f5222d;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;\">驳回</button>
                            </td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style=\"margin-bottom:12px;\">
                <label>常用原因标签：</label>
                <div id=\"audit-tag-list\" style=\"margin:6px 0;\">${tagHtml}</div>
                <input id=\"new-audit-tag\" type=\"text\" placeholder=\"新增自定义标签\" style=\"width:180px;\">
                <button id=\"add-audit-tag\" style=\"margin-left:6px;\">添加</button>
            </div>
            <div style=\"margin-bottom:18px;\">
                <label>审核意见：<textarea id=\"audit-suggestion\" rows=\"5\" style=\"width:98%;\"></textarea></label>
                <button class=\"save-audit\" style=\"background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;\">保存意见</button>
            </div>
            <div style=\"margin-top:18px;\">
                <h3>当前审核意见</h3>
                <p id=\"current-audit-suggestion\" style=\"min-height:24px;\"></p>
            </div>
        </div>`;
        return html;
    }
    // ====== 绑定audit模块事件 ======
    function bindAuditModuleEvents() {
        // 当前选中的考生ID
        let currentStudentId = null;
        // 当前选中考生姓名
        let currentStudentName = '';
        // 标签事件 - 点击标签添加到审核意见
        $(document).off('click','.audit-tag').on('click','.audit-tag',function(){
            const tag=$(this).clone().children().remove().end().text();
            if(currentStudentId) {
                // 只更新 textarea，不直接更新原因
                const $input=$('#audit-suggestion');
                let val=$input.val();
                $input.val(val?(val+','+tag):tag);
            } else {
                showToast('请先点击考生，选择要填写原因的对象');
            }
        });
        // 点击考生原因单元格，标记为当前选中考生
        $(document).off('click','.student-reason').on('click','.student-reason',function(){
            // 移除之前的选中样式
            $('tr[data-student-id]').removeClass('row-selected');
            $('.student-reason').css('background-color', '');
            // 设置当前选中并高亮显示
            currentStudentId = $(this).data('id');
            const $row = $(this).closest('tr');
            $row.addClass('row-selected');
            $(this).css('background-color', '#e6f7ff');
            // 获取考生姓名
            currentStudentName = $row.find('td:first').text();
            showToast(`正在为【${currentStudentName}】填写审核原因`);
            // 填充 textarea 为当前考生的原因
            const stu = studentList.find(s=>s.id==currentStudentId);
            $('#audit-suggestion').val(stu && stu.reason ? stu.reason : '');
        });
        // 删除自定义标签
        $(document).off('click','.del-tag').on('click','.del-tag',function(e){
            e.stopPropagation();
            let tag=$(this).parent().clone().children().remove().end().text();
            let customTags=JSON.parse(localStorage.getItem('customAuditTags')||'[]');
            customTags=customTags.filter(t=>t!==tag);
            localStorage.setItem('customAuditTags',JSON.stringify(customTags));
            $('#main-content').html(getAuditModuleHtml());
            bindAuditModuleEvents();
        });
        // 添加自定义标签
        $('#add-audit-tag').off('click').on('click',function(){
            let tag=$('#new-audit-tag').val().trim();
            if(!tag){showToast('请输入标签内容！');return;}
            let customTags=JSON.parse(localStorage.getItem('customAuditTags')||'[]');
            if(customTags.includes(tag)){showToast('标签已存在！');return;}
            customTags.push(tag);
            localStorage.setItem('customAuditTags',JSON.stringify(customTags));
            $('#main-content').html(getAuditModuleHtml());
            bindAuditModuleEvents();
            $('#new-audit-tag').val('');
        });
        // 保存审核意见
        $('.save-audit').off('click').on('click', function() {
            if(!currentStudentId) {
                showToast('请先点击考生，选择要保存审核意见的对象');
                return;
            }
            const suggestion = $('#audit-suggestion').val();
            // 更新全局 studentList
            const stu = studentList.find(s=>s.id==currentStudentId);
            if(stu) stu.reason = suggestion;
            // 更新页面显示
            $(`.student-reason[data-id=${currentStudentId}]`).text(suggestion||'请选择原因');
            $('#current-audit-suggestion').text(suggestion);
            showToast(`已为【${currentStudentName}】保存审核意见！`);
        });
        // 通过审核操作
        $('.audit-pass').off('click').on('click', function() {
            const id = $(this).data('id');
            const reason = $(`.student-reason[data-id=${id}]`).text();
            if(reason === '请选择原因') {
                showToast('请先选择审核原因！');
                $(`.student-reason[data-id=${id}]`).click();
                return;
            }
            showModal('通过审核', `
                <p>确认通过该考生资料审核？</p>
                <p>审核原因：${reason}</p>
                <textarea id=\"audit-pass-comment\" rows=\"3\" style=\"width:98%;\" placeholder=\"请输入补充意见\"></textarea>
            `, function() {
                showToast('审核已通过！');
                $(`.audit-pass[data-id=${id}]`).closest('tr').find('td:eq(3)').text('已通过');
                // 更新审核意见到当前意见区域
                const comment = $('#audit-pass-comment').val();
                if(comment) {
                    const fullComment = `通过原因：${reason}\n补充意见：${comment}`;
                    $('#current-audit-suggestion').text(fullComment);
                }
            });
        });
        // 驳回审核操作
        $('.audit-reject').off('click').on('click', function() {
            const id = $(this).data('id');
            const reason = $(`.student-reason[data-id=${id}]`).text();
            if(reason === '请选择原因') {
                showToast('请先选择驳回原因！');
                $(`.student-reason[data-id=${id}]`).click();
                return;
            }
            showModal('驳回审核', `
                <p>确认驳回该考生资料审核？</p>
                <p>驳回原因：${reason}</p>
                <textarea id=\"audit-reject-reason\" rows=\"3\" style=\"width:98%;\" placeholder=\"请输入补充说明\"></textarea>
            `, function() {
                showToast('审核已驳回！');
                $(`.audit-reject[data-id=${id}]`).closest('tr').find('td:eq(3)').text('已驳回');
                // 更新驳回原因到当前意见区域
                const comment = $('#audit-reject-reason').val();
                if(comment) {
                    const fullComment = `驳回原因：${reason}\n补充说明：${comment}`;
                    $('#current-audit-suggestion').text(fullComment);
                }
            });
        });
        // 高亮样式
        $('<style>.row-selected{background:#e6f7ff!important;}</style>').appendTo('head');
    }

    // 模拟全国鉴定站数据
    const stationData = [
        { id: 1, name: '北京鉴定站', province: '北京', city: '北京市', status: 'active', planCount: 120, actualCount: 98, waitingCount: 22, skillPassCount: 85, skillTotalCount: 95, theoryPassCount: 90, theoryTotalCount: 98, lat: 39.9042, lng: 116.4074 },
        { id: 2, name: '上海鉴定站', province: '上海', city: '上海市', status: 'completed', planCount: 150, actualCount: 150, waitingCount: 0, skillPassCount: 142, skillTotalCount: 150, theoryPassCount: 145, theoryTotalCount: 150, lat: 31.2304, lng: 121.4737 },
        { id: 3, name: '广州鉴定站', province: '广东', city: '广州市', status: 'active', planCount: 130, actualCount: 89, waitingCount: 41, skillPassCount: 75, skillTotalCount: 89, theoryPassCount: 80, theoryTotalCount: 89, lat: 23.1291, lng: 113.2644 },
        { id: 4, name: '深圳鉴定站', province: '广东', city: '深圳市', status: 'inactive', planCount: 110, actualCount: 0, waitingCount: 110, skillPassCount: 0, skillTotalCount: 0, theoryPassCount: 0, theoryTotalCount: 0, lat: 22.5431, lng: 114.0579 },
        { id: 5, name: '成都鉴定站', province: '四川', city: '成都市', status: 'active', planCount: 100, actualCount: 78, waitingCount: 22, skillPassCount: 70, skillTotalCount: 78, theoryPassCount: 72, theoryTotalCount: 78, lat: 30.5728, lng: 104.0668 },
        { id: 6, name: '重庆鉴定站', province: '重庆', city: '重庆市', status: 'active', planCount: 90, actualCount: 65, waitingCount: 25, skillPassCount: 58, skillTotalCount: 65, theoryPassCount: 60, theoryTotalCount: 65, lat: 29.4316, lng: 106.9123 },
        { id: 7, name: '武汉鉴定站', province: '湖北', city: '武汉市', status: 'completed', planCount: 80, actualCount: 80, waitingCount: 0, skillPassCount: 75, skillTotalCount: 80, theoryPassCount: 78, theoryTotalCount: 80, lat: 30.5928, lng: 114.3055 },
        { id: 8, name: '南京鉴定站', province: '江苏', city: '南京市', status: 'active', planCount: 95, actualCount: 70, waitingCount: 25, skillPassCount: 62, skillTotalCount: 70, theoryPassCount: 65, theoryTotalCount: 70, lat: 32.0603, lng: 118.7969 },
        { id: 9, name: '杭州鉴定站', province: '浙江', city: '杭州市', status: 'active', planCount: 85, actualCount: 60, waitingCount: 25, skillPassCount: 55, skillTotalCount: 60, theoryPassCount: 58, theoryTotalCount: 60, lat: 30.2741, lng: 120.1551 },
        { id: 10, name: '西安鉴定站', province: '陕西', city: '西安市', status: 'inactive', planCount: 75, actualCount: 0, waitingCount: 75, skillPassCount: 0, skillTotalCount: 0, theoryPassCount: 0, theoryTotalCount: 0, lat: 34.3416, lng: 108.9398 },
        { id: 11, name: '天津鉴定站', province: '天津', city: '天津市', status: 'active', planCount: 70, actualCount: 50, waitingCount: 20, skillPassCount: 45, skillTotalCount: 50, theoryPassCount: 48, theoryTotalCount: 50, lat: 39.3434, lng: 117.3616 },
        { id: 12, name: '哈尔滨鉴定站', province: '黑龙江', city: '哈尔滨市', status: 'completed', planCount: 65, actualCount: 65, waitingCount: 0, skillPassCount: 60, skillTotalCount: 65, theoryPassCount: 62, theoryTotalCount: 65, lat: 45.8038, lng: 126.5340 },
        { id: 13, name: '长春鉴定站', province: '吉林', city: '长春市', status: 'active', planCount: 60, actualCount: 45, waitingCount: 15, skillPassCount: 40, skillTotalCount: 45, theoryPassCount: 42, theoryTotalCount: 45, lat: 43.8171, lng: 125.3235 },
        { id: 14, name: '沈阳鉴定站', province: '辽宁', city: '沈阳市', status: 'active', planCount: 55, actualCount: 40, waitingCount: 15, skillPassCount: 35, skillTotalCount: 40, theoryPassCount: 38, theoryTotalCount: 40, lat: 41.8057, lng: 123.4315 },
        { id: 15, name: '济南鉴定站', province: '山东', city: '济南市', status: 'inactive', planCount: 50, actualCount: 0, waitingCount: 50, skillPassCount: 0, skillTotalCount: 0, theoryPassCount: 0, theoryTotalCount: 0, lat: 36.6512, lng: 117.1201 }
    ];
    
    // 模拟实时考核数据
    const realTimeData = {
        totalExaminees: 840,  // 实时考核总数
        theoryExaminees: 650,  // 实时理论考核人数
        skillExaminees: 720,  // 实时技能考核人数
        activeStations: 10,  // 实时鉴定站点数
        activeExaminers: 45,  // 考核中考评员数
        activeTerminals: 120  // 实时终端数
    };
    
    // 模拟实时考核动态数据
    const examDynamicData = [
        { name: '张三', idCard: '110101199001011234', org: '北京鉴定站', direction: '软件开发', level: '中级', examiner: '李明', time: '09:15:30' },
        { name: '李四', idCard: '310101199102022345', org: '上海鉴定站', direction: '网络工程', level: '高级', examiner: '王强', time: '09:16:45' },
        { name: '王五', idCard: '440101199203033456', org: '广州鉴定站', direction: '数据分析', level: '初级', examiner: '张伟', time: '09:17:20' },
        { name: '赵六', idCard: '510101199304044567', org: '成都鉴定站', direction: '人工智能', level: '中级', examiner: '刘芳', time: '09:18:10' },
        { name: '钱七', idCard: '500101199405055678', org: '重庆鉴定站', direction: '云计算', level: '高级', examiner: '陈刚', time: '09:19:05' },
        { name: '孙八', idCard: '420101199506066789', org: '武汉鉴定站', direction: '物联网', level: '初级', examiner: '周红', time: '09:20:30' },
        { name: '周九', idCard: '320101199607077890', org: '南京鉴定站', direction: '大数据', level: '中级', examiner: '吴强', time: '09:21:15' },
        { name: '吴十', idCard: '330101199708088901', org: '杭州鉴定站', direction: '网络安全', level: '高级', examiner: '郑明', time: '09:22:40' },
        { name: '郑十一', idCard: '120101199809099012', org: '天津鉴定站', direction: '软件测试', level: '初级', examiner: '孙亮', time: '09:23:25' },
        { name: '王十二', idCard: '230101199910100123', org: '哈尔滨鉴定站', direction: '前端开发', level: '中级', examiner: '林峰', time: '09:24:50' }
    ];
    
    // ====== 更新screen模块内容 ======
    function getScreenModuleHtml() {
        // 数据大屏内容
        let html = `<div class="card">
            <h2>全国动态考评数据大屏</h2>
            <div style="display:flex;align-items:center;gap:18px;margin-bottom:18px;">
                <label>大屏类型：<select id="screen-type">
                    <option value="overview">全国考核数据概览</option>
                    <option value="realtime">实时考核动态</option>
                    <option value="map">全国鉴定站分布</option>
                    <option value="ranking">全国考核计划排名</option>
                </select></label>
                <button class="refresh-screen" style="background:#2d8cf0;color:#fff;border:none;border-radius:5px;padding:6px 18px;font-size:15px;cursor:pointer;">刷新数据</button>
            </div>
            <div id="screen-content" style="padding:18px;background:#f5f5f5;border-radius:8px;min-height:600px;">
                <!-- 大屏内容将通过AJAX加载或直接填充 -->
                <p>请选择大屏类型查看详细数据。</p>
            </div>
        </div>`;
        return html;
    }
    
    // ====== 绑定screen模块事件 ======
    function bindScreenModuleEvents() {
        // 初始加载
        setTimeout(() => {
            $('.refresh-screen').trigger('click');
        }, 100);
        
        // 刷新数据
        $('.refresh-screen').on('click', function() {
            const type = $('#screen-type').val();
            let content = '<p>正在加载中...</p>';
            
            // 根据选择的大屏类型显示不同内容
            if(type === 'overview') {
                // 全国考核数据概览
                content = generateOverviewContent();
            } else if(type === 'realtime') {
                // 实时考核动态
                content = generateRealtimeContent();
            } else if(type === 'map') {
                // 全国鉴定站分布
                content = generateMapContent();
            } else if(type === 'ranking') {
                // 全国考核计划排名
                content = generateRankingContent();
            }
            
            $('#screen-content').html(content);
            showToast('数据已刷新！');
            
            // 如果是实时考核动态，启动滚动效果
            if(type === 'realtime') {
                startDynamicScroll();
            }
            
            // 如果是地图，初始化地图
            if(type === 'map') {
                initMap();
            }
        });
        
        // 监听大屏类型变化
        $('#screen-type').on('change', function() {
            $('.refresh-screen').trigger('click');
        });
    }
    
    // 生成全国考核数据概览内容
    function generateOverviewContent() {
        // 计算总数据
        let totalPlanCount = 0;
        let totalActualCount = 0;
        let totalWaitingCount = 0;
        let totalSkillPassCount = 0;
        let totalSkillTotalCount = 0;
        let totalTheoryPassCount = 0;
        let totalTheoryTotalCount = 0;
        
        stationData.forEach(station => {
            totalPlanCount += station.planCount;
            totalActualCount += station.actualCount;
            totalWaitingCount += station.waitingCount;
            totalSkillPassCount += station.skillPassCount;
            totalSkillTotalCount += station.skillTotalCount;
            totalTheoryPassCount += station.theoryPassCount;
            totalTheoryTotalCount += station.theoryTotalCount;
        });
        
        // 计算百分比
        const skillPassRate = totalSkillTotalCount > 0 ? ((totalSkillPassCount / totalSkillTotalCount) * 100).toFixed(2) : 0;
        const theoryPassRate = totalTheoryTotalCount > 0 ? ((totalTheoryPassCount / totalTheoryTotalCount) * 100).toFixed(2) : 0;
        const completionRate = totalPlanCount > 0 ? ((totalActualCount / totalPlanCount) * 100).toFixed(2) : 0;
        
        // 生成概览内容
        let content = `
            <h3 style="text-align:center;margin-bottom:20px;color:#2d8cf0;">全国考核数据概览</h3>
            
            <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
                <div style="flex:1;background:#fff;padding:15px;border-radius:8px;margin-right:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h4 style="color:#2d8cf0;margin-bottom:10px;">计划编排总人数</h4>
                    <p style="font-size:24px;font-weight:bold;">${totalPlanCount}</p>
                    <div style="height:5px;background:#f0f0f0;border-radius:3px;margin-top:10px;">
                        <div style="height:5px;background:#2d8cf0;border-radius:3px;width:${completionRate}%;"></div>
                    </div>
                    <p style="font-size:12px;color:#999;margin-top:5px;">完成率: ${completionRate}%</p>
                </div>
                
                <div style="flex:1;background:#fff;padding:15px;border-radius:8px;margin-right:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h4 style="color:#19be6b;margin-bottom:10px;">实际已考核人数</h4>
                    <p style="font-size:24px;font-weight:bold;">${totalActualCount}</p>
                    <div style="display:flex;justify-content:space-between;margin-top:10px;">
                        <span style="font-size:12px;color:#999;">技能考核: ${totalSkillTotalCount}</span>
                        <span style="font-size:12px;color:#999;">理论考核: ${totalTheoryTotalCount}</span>
                    </div>
                </div>
                
                <div style="flex:1;background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h4 style="color:#ff9900;margin-bottom:10px;">待考核人数</h4>
                    <p style="font-size:24px;font-weight:bold;">${totalWaitingCount}</p>
                    <p style="font-size:12px;color:#999;margin-top:10px;">占计划总人数的 ${(totalWaitingCount / totalPlanCount * 100).toFixed(2)}%</p>
                </div>
            </div>
            
            <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
                <div style="flex:1;background:#fff;padding:15px;border-radius:8px;margin-right:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h4 style="color:#2d8cf0;margin-bottom:10px;">技能考核情况</h4>
                    <div style="display:flex;align-items:center;">
                        <div style="flex:1;">
                            <p style="font-size:18px;font-weight:bold;">${totalSkillPassCount} / ${totalSkillTotalCount}</p>
                            <p style="font-size:12px;color:#999;">合格人数 / 总人数</p>
                        </div>
                        <div style="width:60px;height:60px;position:relative;">
                            <svg viewBox="0 0 36 36" style="width:60px;height:60px;">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"></path>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2d8cf0" stroke-width="3" stroke-dasharray="${skillPassRate}, 100"></path>
                            </svg>
                            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:bold;">${skillPassRate}%</div>
                        </div>
                    </div>
                </div>
                
                <div style="flex:1;background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                    <h4 style="color:#19be6b;margin-bottom:10px;">理论考核情况</h4>
                    <div style="display:flex;align-items:center;">
                        <div style="flex:1;">
                            <p style="font-size:18px;font-weight:bold;">${totalTheoryPassCount} / ${totalTheoryTotalCount}</p>
                            <p style="font-size:12px;color:#999;">合格人数 / 总人数</p>
                        </div>
                        <div style="width:60px;height:60px;position:relative;">
                            <svg viewBox="0 0 36 36" style="width:60px;height:60px;">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" stroke-width="3"></path>
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#19be6b" stroke-width="3" stroke-dasharray="${theoryPassRate}, 100"></path>
                            </svg>
                            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:bold;">${theoryPassRate}%</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h4 style="color:#2d8cf0;margin-bottom:15px;">实时考核数据</h4>
                <div style="display:flex;flex-wrap:wrap;">
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">实时考核总数</p>
                            <p style="font-size:20px;font-weight:bold;color:#2d8cf0;">${realTimeData.totalExaminees}</p>
                        </div>
                    </div>
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">实时理论考核人数</p>
                            <p style="font-size:20px;font-weight:bold;color:#19be6b;">${realTimeData.theoryExaminees}</p>
                        </div>
                    </div>
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">实时技能考核人数</p>
                            <p style="font-size:20px;font-weight:bold;color:#ff9900;">${realTimeData.skillExaminees}</p>
                        </div>
                    </div>
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">实时鉴定站点</p>
                            <p style="font-size:20px;font-weight:bold;color:#2d8cf0;">${realTimeData.activeStations}</p>
                        </div>
                    </div>
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">考核中考评员数据</p>
                            <p style="font-size:20px;font-weight:bold;color:#19be6b;">${realTimeData.activeExaminers}</p>
                        </div>
                    </div>
                    <div style="width:33.33%;padding:10px;box-sizing:border-box;">
                        <div style="background:#f8f8f8;padding:15px;border-radius:5px;text-align:center;">
                            <p style="font-size:12px;color:#999;margin-bottom:5px;">实时终端数</p>
                            <p style="font-size:20px;font-weight:bold;color:#ff9900;">${realTimeData.activeTerminals}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }
    
    // 生成实时考核动态内容
    function generateRealtimeContent() {
        let content = `
            <h3 style="text-align:center;margin-bottom:20px;color:#2d8cf0;">实时考核动态滚动数据</h3>
            
            <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <div style="margin-bottom:15px;display:flex;justify-content:space-between;align-items:center;">
                    <h4 style="color:#2d8cf0;margin:0;">考生考评实时记录</h4>
                    <p style="margin:0;font-size:12px;color:#999;">更新时间: ${getCurrentTimeString()}</p>
                </div>
                
                <div id="dynamic-scroll-container" style="height:400px;overflow:hidden;">
                    <table class="data-table" style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f5f5f5;">
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">考生姓名</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">身份证号</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">所属机构</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">方向</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">级别</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">考评员</th>
                                <th style="padding:10px;text-align:left;border:1px solid #ddd;">考核时间</th>
                            </tr>
                        </thead>
                        <tbody id="dynamic-data-body">
                            ${examDynamicData.map(item => `
                                <tr>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.name}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.idCard}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.org}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.direction}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.level}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.examiner}</td>
                                    <td style="padding:10px;text-align:left;border:1px solid #ddd;">${item.time}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        return content;
    }
    
    // 启动动态滚动效果
    function startDynamicScroll() {
        let scrollInterval;
        const container = document.getElementById('dynamic-scroll-container');
        if (!container) return;
        
        // 清除之前的定时器
        clearInterval(scrollInterval);
        
        // 设置新的定时器
        scrollInterval = setInterval(() => {
            if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
                // 滚动到底部后，重置到顶部
                container.scrollTop = 0;
            } else {
                // 平滑滚动
                container.scrollTop += 1;
            }
        }, 50);
        
        // 鼠标悬停时暂停滚动
        container.addEventListener('mouseenter', () => {
            clearInterval(scrollInterval);
        });
        
        // 鼠标离开时恢复滚动
        container.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(() => {
                if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
                    container.scrollTop = 0;
                } else {
                    container.scrollTop += 1;
                }
            }, 50);
        });
    }
    
    // 生成全国鉴定站分布地图内容
    function generateMapContent() {
        let content = `
            <h3 style="text-align:center;margin-bottom:20px;color:#2d8cf0;">全国鉴定站分布</h3>
            
            <div style="display:flex;">
                <div id="map-container" style="flex:3;height:500px;background:#f5f5f5;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);"></div>
                
                <div style="flex:1;margin-left:20px;">
                    <div style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:15px;">
                        <h4 style="color:#2d8cf0;margin-bottom:10px;">站点状态说明</h4>
                        <div style="display:flex;align-items:center;margin-bottom:8px;">
                            <div style="width:15px;height:15px;background:#ff9900;border-radius:50%;margin-right:8px;"></div>
                            <span>考核中</span>
                        </div>
                        <div style="display:flex;align-items:center;margin-bottom:8px;">
                            <div style="width:15px;height:15px;background:#19be6b;border-radius:50%;margin-right:8px;"></div>
                            <span>考核完成</span>
                        </div>
                        <div style="display:flex;align-items:center;">
                            <div style="width:15px;height:15px;background:#c5c8ce;border-radius:50%;margin-right:8px;"></div>
                            <span>未安排考核</span>
                        </div>
                    </div>
                    
                    <div id="station-info" style="background:#fff;padding:15px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <h4 style="color:#2d8cf0;margin-bottom:10px;">站点信息</h4>
                        <p style="color:#999;font-size:12px;">点击地图上的站点查看详情</p>
                    </div>
                </div>
            </div>
        `;
        
        return content;
    }
    
    // 初始化地图
    function initMap() {
        // 模拟地图初始化和站点标记
        // 在实际项目中，这里应该使用真实的地图API，如百度地图、高德地图等
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;
        
        // 模拟地图内容
        let mapHtml = `
            <div style="position:relative;width:100%;height:100%;background:#e8f4fc;overflow:hidden;border-radius:8px;">
                <!-- 模拟中国地图轮廓 -->
                <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80%;height:80%;background:#d1e9fb;border-radius:40%;">
                    <!-- 这里只是一个简单的模拟，实际项目中应使用真实地图 -->
                </div>
                
                <!-- 模拟站点标记 -->
                ${stationData.map(station => {
                    // 根据状态确定颜色
                    let color = '#c5c8ce'; // 默认灰色（未安排）
                    if (station.status === 'active') {
                        color = '#ff9900'; // 橙色（考核中）
                    } else if (station.status === 'completed') {
                        color = '#19be6b'; // 绿色（考核完成）
                    }
                    
                    // 计算相对位置（这里只是模拟）
                    const left = 10 + (station.lng - 100) * 5;
                    const top = 80 - (station.lat - 20) * 5;
                    
                    return `
                        <div class="map-marker" data-id="${station.id}" style="position:absolute;left:${left}%;top:${top}%;">
                            <div style="width:12px;height:12px;background:${color};border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.8);cursor:pointer;"></div>
                            <div style="position:absolute;top:-25px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;padding:2px 6px;border-radius:3px;font-size:10px;white-space:nowrap;">${station.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        mapContainer.innerHTML = mapHtml;
        
        // 添加站点点击事件
        setTimeout(() => {
            document.querySelectorAll('.map-marker').forEach(marker => {
                marker.addEventListener('click', function() {
                    const stationId = this.getAttribute('data-id');
                    const station = stationData.find(s => s.id == stationId);
                    if (station) {
                        showStationInfo(station);
                    }
                });
            });
        }, 100);
    }
    
    // 显示站点详细信息
    function showStationInfo(station) {
        const stationInfo = document.getElementById('station-info');
        if (!stationInfo) return;
        
        // 根据状态确定文本
        let statusText = '未安排考核';
        let statusColor = '#c5c8ce';
        if (station.status === 'active') {
            statusText = '考核中';
            statusColor = '#ff9900';
        } else if (station.status === 'completed') {
            statusText = '考核完成';
            statusColor = '#19be6b';
        }
        
        // 计算完成率
        const completionRate = station.planCount > 0 ? ((station.actualCount / station.planCount) * 100).toFixed(2) : 0;
        
        // 更新站点信息
        stationInfo.innerHTML = `
            <h4 style="color:#2d8cf0;margin-bottom:15px;">${station.name}站点画像</h4>
            <p><strong>所在地区：</strong>${station.province} ${station.city}</p>
            <p><strong>当前状态：</strong><span style="color:${statusColor};">${statusText}</span></p>
            <p><strong>计划考核人数：</strong>${station.planCount}</p>
            <p><strong>实际考核人数：</strong>${station.actualCount}</p>
            <p><strong>完成率：</strong>${completionRate}%</p>
            <div style="height:5px;background:#f0f0f0;border-radius:3px;margin:5px 0 10px;">
                <div style="height:5px;background:#2d8cf0;border-radius:3px;width:${completionRate}%;"></div>
            </div>
            <p><strong>技能考核：</strong>${station.skillPassCount}/${station.skillTotalCount} (合格/总数)</p>
            <p><strong>理论考核：</strong>${station.theoryPassCount}/${station.theoryTotalCount} (合格/总数)</p>
        `;
    }
    
    // 生成全国考核计划排名内容
    function generateRankingContent() {
        // 按计划人数排序
        const sortedByPlan = [...stationData].sort((a, b) => b.planCount - a.planCount);
        
        // 按实际考核人数排序
        const sortedByActual = [...stationData].sort((a, b) => b.actualCount - a.actualCount);
        
        let content = `
            <h3 style="text-align:center;margin-bottom:20px;color:#2d8cf0;">全国考核计划排名</h3>
            
            <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
                <div style="flex:1;margin-right:10px;">
                    <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <h4 style="color:#2d8cf0;margin-bottom:15px;">计划考核人数排名</h4>
                        <table class="data-table" style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="background:#f5f5f5;">
                                    <th style="padding:10px;text-align:center;border:1px solid #ddd;">排名</th>
                                    <th style="padding:10px;text-align:left;border:1px solid #ddd;">鉴定站</th>
                                    <th style="padding:10px;text-align:center;border:1px solid #ddd;">计划人数</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedByPlan.slice(0, 10).map((station, index) => `
                                    <tr>
                                        <td style="padding:10px;text-align:center;border:1px solid #ddd;">${index + 1}</td>
                                        <td style="padding:10px;text-align:left;border:1px solid #ddd;">${station.name}</td>
                                        <td style="padding:10px;text-align:center;border:1px solid #ddd;">${station.planCount}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div style="flex:1;">
                    <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                        <h4 style="color:#19be6b;margin-bottom:15px;">实际考核人数排名</h4>
                        <table class="data-table" style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="background:#f5f5f5;">
                                    <th style="padding:10px;text-align:center;border:1px solid #ddd;">排名</th>
                                    <th style="padding:10px;text-align:left;border:1px solid #ddd;">鉴定站</th>
                                    <th style="padding:10px;text-align:center;border:1px solid #ddd;">实际人数</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedByActual.slice(0, 10).map((station, index) => `
                                    <tr>
                                        <td style="padding:10px;text-align:center;border:1px solid #ddd;">${index + 1}</td>
                                        <td style="padding:10px;text-align:left;border:1px solid #ddd;">${station.name}</td>
                                        <td style="padding:10px;text-align:center;border:1px solid #ddd;">${station.actualCount}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div style="background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h4 style="color:#2d8cf0;margin-bottom:15px;">各鉴定站完成率对比</h4>
                <div style="display:flex;flex-wrap:wrap;">
                    ${stationData.map(station => {
                        const completionRate = station.planCount > 0 ? ((station.actualCount / station.planCount) * 100).toFixed(2) : 0;
                        return `
                            <div style="width:25%;padding:10px;box-sizing:border-box;">
                                <div style="background:#f8f8f8;padding:15px;border-radius:5px;">
                                    <p style="font-size:14px;margin-bottom:8px;">${station.name}</p>
                                    <div style="height:5px;background:#f0f0f0;border-radius:3px;margin-bottom:5px;">
                                        <div style="height:5px;background:#2d8cf0;border-radius:3px;width:${completionRate}%;"></div>
                                    </div>
                                    <div style="display:flex;justify-content:space-between;font-size:12px;">
                                        <span>${station.actualCount}/${station.planCount}</span>
                                        <span>${completionRate}%</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        return content;
    }

    function nowTime() {
        const d = new Date();
        return d.getFullYear()+'-'+(d.getMonth()+1).toString().padStart(2,'0')+'-'+d.getDate().toString().padStart(2,'0')+' '+d.getHours().toString().padStart(2,'0')+':'+d.getMinutes().toString().padStart(2,'0');
    }
});