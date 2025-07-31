// 数据大屏模块

// 获取数据大屏HTML
function getScreenModuleHtml() {
    let html = `
    <div class="screen-container">
        <!-- 退出按钮 -->
            <div class="screen-exit">
                <button class="exit-btn">退出</button>
            </div>
        
        <!-- 大屏标题 -->
        <div class="screen-header">
            <div class="screen-title">全国动态考评数据大屏</div>
        </div>
        
        <!-- 主要内容区域 -->
        <div class="screen-content">
            <!-- 顶部统计卡片区域 -->
            <div class="top-stats">
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="planned-count">15,847</div>
                        <div class="stat-label">计划编排人数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-check"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="actual-count">12,456</div>
                        <div class="stat-label">实际已考核人数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-clock"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="waiting-count">3,391</div>
                        <div class="stat-label">待考核人数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-tools"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="skills-count">8,234</div>
                        <div class="stat-label">技能已考人数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-award"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="skills-pass-count">7,156</div>
                        <div class="stat-label">技能合格人数</div>
                        </div>
                        </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-book"></i></div>
                    <div class="stat-info">
                        <div class="stat-value" id="theory-count">7,613</div>
                        <div class="stat-label">理论已考人数</div>
                    </div>
                </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-certificate"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="theory-pass-count">6,789</div>
                        <div class="stat-label">理论合格人数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="realtime-total">1,847</div>
                        <div class="stat-label">实时考核总数</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-user-tie"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="assessors-count">456</div>
                        <div class="stat-label">考核中考评员</div>
                        </div>
                    </div>
                    <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-desktop"></i></div>
                        <div class="stat-info">
                        <div class="stat-value" id="terminals-count">1,234</div>
                        <div class="stat-label">实时终端数</div>
                        </div>
                    </div>
                </div>
                
                <!-- 实时数据卡片区域 -->
                <div class="realtime-stats">
                    <div class="realtime-card">
                        <div class="realtime-icon">📚</div>
                        <div class="realtime-info">
                            <div class="realtime-value" id="realtime-theory-count">3,456</div>
                            <div class="realtime-label">实时考核理论数</div>
                            <div class="realtime-trend" id="realtime-theory-trend">+12.5%</div>
                        </div>
                    </div>
                    <div class="realtime-card">
                        <div class="realtime-icon">🔧</div>
                        <div class="realtime-info">
                            <div class="realtime-value" id="realtime-skills-candidates">2,789</div>
                            <div class="realtime-label">实时技能考核考生人数</div>
                            <div class="realtime-trend" id="realtime-skills-trend">+8.3%</div>
                        </div>
                    </div>
                    <div class="realtime-card">
                        <div class="realtime-icon">📍</div>
                        <div class="realtime-info">
                            <div class="realtime-value" id="realtime-stations-count">156</div>
                            <div class="realtime-label">实时鉴定站点</div>
                            <div class="realtime-trend" id="realtime-stations-trend">+5.2%</div>
                        </div>
                    </div>
                </div>
                
            <!-- 中部内容区域 -->
            <div class="middle-content">
                <!-- 左侧：实时考核动态滚动数据 -->
                <div class="left-panel">
                    <div class="panel-title">实时考核动态</div>
                    <div class="realtime-list" id="realtime-list">
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">张三</div>
                                <div class="id-card">110101199001011234</div>
                                <div class="org">北京职业技能鉴定中心</div>
                                </div>
                            <div class="item-details">
                                <div class="direction">计算机程序设计员</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：李四</div>
                            </div>
                                </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">王五</div>
                                <div class="id-card">320102199203154567</div>
                                <div class="org">上海职业技能鉴定中心</div>
                            </div>
                            <div class="item-details">
                                <div class="direction">网络工程师</div>
                                <div class="level">中级</div>
                                <div class="evaluator">考评员：赵六</div>
                                </div>
                            </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">陈七</div>
                                <div class="id-card">440103199505208901</div>
                                <div class="org">广州职业技能鉴定中心</div>
                                </div>
                            <div class="item-details">
                                <div class="direction">软件测试工程师</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：孙八</div>
                            </div>
                                </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">刘九</div>
                                <div class="id-card">110104199108123456</div>
                                <div class="org">北京职业技能鉴定中心</div>
                            </div>
                            <div class="item-details">
                                <div class="direction">数据库管理员</div>
                                <div class="level">中级</div>
                                <div class="evaluator">考评员：周十</div>
                        </div>
                    </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">吴十一</div>
                                <div class="id-card">320105199412078901</div>
                                <div class="org">南京职业技能鉴定中心</div>
                    </div>
                            <div class="item-details">
                                <div class="direction">系统架构师</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：郑十二</div>
                        </div>
                        </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">林十三</div>
                                <div class="id-card">440106199607234567</div>
                                <div class="org">深圳职业技能鉴定中心</div>
                        </div>
                            <div class="item-details">
                                <div class="direction">人工智能工程师</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：黄十四</div>
                    </div>
                </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">杨十五</div>
                                <div class="id-card">110107199309156789</div>
                                <div class="org">北京职业技能鉴定中心</div>
            </div>
                            <div class="item-details">
                                <div class="direction">云计算工程师</div>
                                <div class="level">中级</div>
                                <div class="evaluator">考评员：徐十六</div>
                                </div>
                            </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">朱十七</div>
                                <div class="id-card">320108199711098765</div>
                                <div class="org">苏州职业技能鉴定中心</div>
                                </div>
                            <div class="item-details">
                                <div class="direction">大数据分析师</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：马十八</div>
                            </div>
                                </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">胡十九</div>
                                <div class="id-card">440109199804123456</div>
                                <div class="org">东莞职业技能鉴定中心</div>
                            </div>
                            <div class="item-details">
                                <div class="direction">网络安全工程师</div>
                                <div class="level">中级</div>
                                <div class="evaluator">考评员：郭二十</div>
                                </div>
                            </div>
                        <div class="list-item">
                            <div class="item-info">
                                <div class="name">何二一</div>
                                <div class="id-card">110110199601078901</div>
                                <div class="org">天津职业技能鉴定中心</div>
                        </div>
                            <div class="item-details">
                                <div class="direction">移动应用开发工程师</div>
                                <div class="level">高级</div>
                                <div class="evaluator">考评员：高二二</div>
                        </div>
                    </div>
                </div>
            </div>
            
                <!-- 中部：地图数据 -->
                <div class="center-panel">
                    <div class="panel-title">全国鉴定站分布</div>
                    <div class="map-container">
                        <div id="china-map" style="width: 100%; height: 100%;"></div>
                        </div>
                    <div class="map-legend">
                        <div class="legend-item">
                            <div class="legend-color orange"></div>
                            <div class="legend-text">考核中</div>
                    </div>
                        <div class="legend-item">
                            <div class="legend-color green"></div>
                            <div class="legend-text">考核完成</div>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color gray"></div>
                            <div class="legend-text">未组织安排</div>
                        </div>
                    </div>
                </div>
                
                <!-- 右侧：全国考核计划排名 -->
                <div class="right-panel">
                    <div class="panel-title">全国考核计划排名</div>
                        <div class="ranking-list">
                        <div class="ranking-item">
                            <div class="rank">1</div>
                            <div class="rank-info">
                                <div class="rank-name">北京职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：2,847人</span>
                                    <span class="actual">实际：2,456人</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ranking-item">
                            <div class="rank">2</div>
                            <div class="rank-info">
                                <div class="rank-name">上海职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：2,156人</span>
                                    <span class="actual">实际：1,987人</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ranking-item">
                            <div class="rank">3</div>
                            <div class="rank-info">
                                <div class="rank-name">广州职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：1,987人</span>
                                    <span class="actual">实际：1,756人</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ranking-item">
                            <div class="rank">4</div>
                            <div class="rank-info">
                                <div class="rank-name">深圳职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：1,756人</span>
                                    <span class="actual">实际：1,523人</span>
                                        </div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="rank">5</div>
                            <div class="rank-info">
                                <div class="rank-name">杭州职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：1,523人</span>
                                    <span class="actual">实际：1,298人</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ranking-item">
                            <div class="rank">6</div>
                            <div class="rank-info">
                                <div class="rank-name">南京职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：1,298人</span>
                                    <span class="actual">实际：1,087人</span>
                                        </div>
                                    </div>
                                </div>
                        <div class="ranking-item">
                            <div class="rank">7</div>
                            <div class="rank-info">
                                <div class="rank-name">武汉职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：1,087人</span>
                                    <span class="actual">实际：987人</span>
                            </div>
                        </div>
                    </div>
                        <div class="ranking-item">
                            <div class="rank">8</div>
                            <div class="rank-info">
                                <div class="rank-name">成都职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：987人</span>
                                    <span class="actual">实际：876人</span>
                            </div>
                            </div>
                            </div>
                        <div class="ranking-item">
                            <div class="rank">9</div>
                            <div class="rank-info">
                                <div class="rank-name">重庆职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：876人</span>
                                    <span class="actual">实际：765人</span>
                            </div>
                            </div>
                            </div>
                        <div class="ranking-item">
                            <div class="rank">10</div>
                            <div class="rank-info">
                                <div class="rank-name">西安职业技能鉴定中心</div>
                                <div class="rank-data">
                                    <span class="planned">计划：765人</span>
                                    <span class="actual">实际：654人</span>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}

// 绑定事件
function bindScreenModuleEvents() {
    // 退出按钮事件
    $('.exit-btn').click(function() {
        // 退出时移除主内容，显示登录页
        $('.screen-container').fadeOut(300, function() {
            $(this).remove();
            if (typeof showLoginPage === 'function') {
                showLoginPage();
            }
        });
    });
    
    // 初始化地图
    initMap();
    
    // 启动实时滚动
    startRealtimeScroll();
    
    // 启动动态数据更新
    startDynamicDataUpdate();
}

// 动态数据更新函数
function startDynamicDataUpdate() {
    // 初始化基准数据
    let baseData = {
        'planned-count': 15847,
        'actual-count': 12456,
        'waiting-count': 3391,
        'skills-count': 8234,
        'skills-pass-count': 7156,
        'theory-count': 7613,
        'theory-pass-count': 6789,
        'realtime-total': 1847,
        'assessors-count': 456,
        'terminals-count': 1234,
        'realtime-theory-count': 3456,
        'realtime-skills-candidates': 2789,
        'realtime-stations-count': 156
    };
    
    // 更新所有统计数据的函数
    function updateAllStats() {
        // 生成合理的增量变化（-2% 到 +3%）
        Object.keys(baseData).forEach(key => {
            const currentValue = baseData[key];
            const changePercent = (Math.random() * 5 - 2) / 100; // -2% 到 +3%
            const change = Math.floor(currentValue * changePercent);
            
            // 确保数据不会变成负数，且考核人数只会增加或小幅减少
            if (key.includes('count') || key.includes('total')) {
                // 考核相关数据主要增加，偶尔小幅减少
                const isIncrease = Math.random() > 0.3; // 70%概率增加
                if (isIncrease) {
                    baseData[key] = Math.max(currentValue + Math.floor(Math.random() * 50 + 10), currentValue);
                } else {
                    baseData[key] = Math.max(currentValue - Math.floor(Math.random() * 20 + 5), Math.floor(currentValue * 0.95));
                }
            } else {
                baseData[key] = Math.max(currentValue + change, Math.floor(currentValue * 0.9));
            }
        });
        
        // 更新显示
        Object.keys(baseData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = baseData[id].toLocaleString();
            }
        });
        
        // 更新趋势数据
        updateTrends();
    }
    
    // 更新趋势数据的函数
    function updateTrends() {
        const trendElements = [
            'realtime-theory-trend',
            'realtime-skills-trend', 
            'realtime-stations-trend'
        ];
        
        trendElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // 生成更合理的趋势变化（-5% 到 +8%）
                const isPositive = Math.random() > 0.4; // 60%概率为正
                const value = (Math.random() * 13 - 5).toFixed(1); // -5% 到 +8%
                const trend = isPositive ? `+${value}%` : `${value}%`;
                element.textContent = trend;
                element.style.color = isPositive ? '#52c41a' : '#ff4d4f';
            }
        });
    }
    
    // 立即更新一次
    updateAllStats();
    
    // 每8秒更新一次数据（降低更新频率）
    setInterval(updateAllStats, 8000);
}

// 初始化地图
function initMap() {
    if (document.getElementById('china-map')) {
        const mapContainer = document.getElementById('china-map');
        
        // 简单的中国地图轮廓 + 站点标注
        mapContainer.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; background: linear-gradient(135deg, #0a1a2f 0%, #1a2a4f 50%, #0a1a2f 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <!-- 中国地图轮廓背景 -->
                <div style="position: relative; width: 95%; height: 95%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    <!-- 简单的中国地图轮廓 -->
                    <div style="position: absolute; width: 100%; height: 100%; background: rgba(173, 216, 230, 0.3); border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.5);"></div>
                    
                    <div style="color: #fff; font-size: 18px; text-align: center; position: relative; z-index: 2;">
                        <!-- <div style="margin-bottom: 10px;">中国地图</div> -->
                        <!-- <div style="font-size: 14px; color: #ccc;">全国鉴定站分布</div> -->
                    </div>
                    
                    <!-- 站点标注 - 带名称的彩色圆点 -->
                    <!-- 北京职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 25%; left: 55%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="北京职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 18%; left: 55%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">北京</div>
                    
                    <!-- 上海职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 40%; left: 65%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="上海职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 33%; left: 65%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">上海</div>
                    
                    <!-- 广州职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 70%; left: 60%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="广州职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 63%; left: 60%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">广州</div>
                    
                    <!-- 深圳职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 75%; left: 58%; width: 12px; height: 12px; background: #19be6b; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #19be6b; z-index: 3;" title="深圳职业技能鉴定中心 - 考核完成"></div>
                    <div style="position: absolute; top: 68%; left: 58%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">深圳</div>
                    
                    <!-- 杭州职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 45%; left: 62%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="杭州职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 38%; left: 62%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">杭州</div>
                    
                    <!-- 南京职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 50%; left: 55%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="南京职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 43%; left: 55%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">南京</div>
                    
                    <!-- 武汉职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 55%; left: 50%; width: 12px; height: 12px; background: #19be6b; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #19be6b; z-index: 3;" title="武汉职业技能鉴定中心 - 考核完成"></div>
                    <div style="position: absolute; top: 48%; left: 50%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">武汉</div>
                    
                    <!-- 成都职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 60%; left: 35%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="成都职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 53%; left: 35%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">成都</div>
                    
                    <!-- 重庆职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 65%; left: 40%; width: 12px; height: 12px; background: #ff9900; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #ff9900; z-index: 3;" title="重庆职业技能鉴定中心 - 考核中"></div>
                    <div style="position: absolute; top: 58%; left: 40%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">重庆</div>
                    
                    <!-- 西安职业技能鉴定中心 -->
                    <div class="station-dot" style="position: absolute; top: 35%; left: 45%; width: 12px; height: 12px; background: #8a8a8a; border-radius: 50%; border: 2px solid #fff; cursor: pointer; box-shadow: 0 0 8px #8a8a8a; z-index: 3;" title="西安职业技能鉴定中心 - 未组织安排"></div>
                    <div style="position: absolute; top: 28%; left: 45%; color: #fff; font-size: 12px; z-index: 3; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px;">西安</div>
                </div>
                
                <!-- 图例 -->
                <div style="position: absolute; bottom: 15px; right: 15px; background: rgba(0, 0, 0, 0.8); padding: 12px; border-radius: 8px; font-size: 12px; z-index: 4;">
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <div style="width: 10px; height: 10px; background: #ff9900; border-radius: 50%; margin-right: 8px;"></div>
                        <span style="color: #fff;">考核中</span>
                    </div>
                    <div style="display: flex; align-items: center; margin-bottom: 8px;">
                        <div style="width: 10px; height: 10px; background: #19be6b; border-radius: 50%; margin-right: 8px;"></div>
                        <span style="color: #fff;">考核完成</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div style="width: 10px; height: 10px; background: #8a8a8a; border-radius: 50%; margin-right: 8px;"></div>
                        <span style="color: #fff;">未组织安排</span>
                    </div>
                </div>
            </div>
        `;
        
        // 添加站点点击事件
        const dots = mapContainer.querySelectorAll('.station-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const title = this.getAttribute('title');
                const [name, status] = title.split(' - ');
                
                // 根据站点名称获取对应的排名数据
                const stationData = getStationRankingData(name);
                
                // 显示站点详情
                showStationDetails({
                    name: name,
                    status: status,
                    statusColor: status === '考核中' ? '#ff9900' : status === '考核完成' ? '#19be6b' : '#8a8a8a',
                    value: [116, 39, stationData.actual],
                    type: '职业技能鉴定',
                    rankingData: stationData
                });
            });
            
            // 添加悬停效果
            dot.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            dot.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

// 获取站点排名数据
function getStationRankingData(stationName) {
    const rankingData = {
        '北京职业技能鉴定中心': { planned: 2847, actual: 2456, rank: 1 },
        '上海职业技能鉴定中心': { planned: 2156, actual: 1987, rank: 2 },
        '广州职业技能鉴定中心': { planned: 1987, actual: 1756, rank: 3 },
        '深圳职业技能鉴定中心': { planned: 1756, actual: 1523, rank: 4 },
        '杭州职业技能鉴定中心': { planned: 1523, actual: 1298, rank: 5 },
        '南京职业技能鉴定中心': { planned: 1298, actual: 1087, rank: 6 },
        '武汉职业技能鉴定中心': { planned: 1087, actual: 987, rank: 7 },
        '成都职业技能鉴定中心': { planned: 876, actual: 765, rank: 8 },
        '重庆职业技能鉴定中心': { planned: 765, actual: 654, rank: 9 },
        '西安职业技能鉴定中心': { planned: 654, actual: 543, rank: 10 }
    };
    
    return rankingData[stationName] || { planned: 0, actual: 0, rank: 0 };
}

// 显示站点详细信息
function showStationDetails(stationData) {
    // 创建模态框显示站点画像信息
    const modal = document.createElement('div');
    modal.className = 'station-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const content = document.createElement('div');
    content.className = 'station-modal-content';
    content.style.cssText = `
        background: linear-gradient(135deg, #0a1a2f 0%, #1a2a4f 50%, #0a1a2f 100%);
        border: 2px solid #2d8cf0;
        border-radius: 12px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        color: #fff;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        position: relative;
        animation: modalFadeIn 0.3s ease-out;
    `;
    
    const completionRate = stationData.rankingData ? Math.round((stationData.rankingData.actual / stationData.rankingData.planned) * 100) : 0;
    
    content.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2d8cf0; font-size: 24px;">${stationData.name}</h2>
            <div style="margin-top: 10px; padding: 8px 16px; background: rgba(45, 140, 240, 0.2); border-radius: 6px; display: inline-block;">
                <span style="color: ${stationData.statusColor};">${stationData.status}</span>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #2d8cf0;">基本信息</h4>
                <p style="margin: 5px 0; color: #ccc;">站点类型: ${stationData.type}</p>
                <p style="margin: 5px 0; color: #ccc;">考核人数: ${stationData.value[2]}人</p>
                <p style="margin: 5px 0; color: #ccc;">地理位置: ${stationData.value[0].toFixed(2)}, ${stationData.value[1].toFixed(2)}</p>
            </div>
            
            <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #2d8cf0;">考核统计</h4>
                <p style="margin: 5px 0; color: #ccc;">计划人数: ${stationData.rankingData ? stationData.rankingData.planned : 0}人</p>
                <p style="margin: 5px 0; color: #ccc;">实际人数: ${stationData.rankingData ? stationData.rankingData.actual : 0}人</p>
                <p style="margin: 5px 0; color: #ccc;">完成率: ${completionRate}%</p>
            </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #2d8cf0;">排名信息</h4>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #2d8cf0, #19be6b); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; color: #fff;">
                    ${stationData.rankingData ? stationData.rankingData.rank : '-'}
                </div>
                <div>
                    <p style="margin: 5px 0; color: #ccc;">全国排名: 第${stationData.rankingData ? stationData.rankingData.rank : 0}名</p>
                    <p style="margin: 5px 0; color: #ccc;">考核项目: ${stationData.type}</p>
                </div>
            </div>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 10px 0; color: #2d8cf0;">考核项目</h4>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <span style="background: rgba(45, 140, 240, 0.3); padding: 5px 10px; border-radius: 4px; font-size: 12px;">${stationData.type}</span>
                <span style="background: rgba(25, 190, 107, 0.3); padding: 5px 10px; border-radius: 4px; font-size: 12px;">技能考核</span>
                <span style="background: rgba(255, 153, 0, 0.3); padding: 5px 10px; border-radius: 4px; font-size: 12px;">理论考试</span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button class="close-btn" style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: #fff;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            ">关闭</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // 绑定关闭按钮事件
    const closeBtn = content.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });
    
    // 点击背景关闭模态框
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// 启动实时数据滚动
function startRealtimeScroll() {
    const list = document.getElementById('realtime-list');
    if (!list) return;
    
    // 克隆列表项以实现无缝滚动
    const items = list.querySelectorAll('.list-item');
    if (items.length === 0) return;
    
    // 复制列表项到末尾
    items.forEach(item => {
        const clone = item.cloneNode(true);
        list.appendChild(clone);
    });
    
    // 使用CSS动画实现滚动，更平滑且不会超出容器
    list.style.animation = 'scrollUp 30s linear infinite';
    
    // 鼠标悬停时暂停滚动
    list.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });
    
    list.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}