import { useState, useEffect } from "react";
import { Button, Tag, Spin, message } from "antd";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileTextOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  ReloadOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import styles from "./index.module.scss";

interface StatsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  growthRate: number;
  userTrend: number;
  orderTrend: number;
  revenueTrend: number;
}

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    growthRate: 0,
    userTrend: 0,
    orderTrend: 0,
    revenueTrend: 0,
  });

  // 快捷操作配置
  const quickActions = [
    {
      key: 'user',
      title: '用户管理',
      icon: <UserOutlined />,
      path: '/user',
      description: '管理系统用户信息'
    },
    {
      key: 'role',
      title: '角色管理',
      icon: <TeamOutlined />,
      path: '/role',
      description: '配置用户角色权限'
    },
    {
      key: 'menu',
      title: '菜单管理',
      icon: <MenuOutlined />,
      path: '/menu',
      description: '管理系统菜单结构'
    },
    {
      key: 'dict',
      title: '字典管理',
      icon: <DatabaseOutlined />,
      path: '/dict',
      description: '维护系统字典数据'
    },
    {
      key: 'job',
      title: '定时任务',
      icon: <ScheduleOutlined />,
      path: '/monitor/job',
      description: '管理系统定时任务'
    },
    {
      key: 'parameter',
      title: '参数设置',
      icon: <SettingOutlined />,
      path: '/parameter',
      description: '配置系统参数'
    },
    {
      key: 'announcement',
      title: '公告管理',
      icon: <FileTextOutlined />,
      path: '/announcement',
      description: '发布系统公告'
    },
    {
      key: 'department',
      title: '部门管理',
      icon: <BarChartOutlined />,
      path: '/department',
      description: '管理组织架构'
    }
  ];

  // 模拟数据加载
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatsData({
        totalUsers: 12580,
        totalOrders: 8964,
        totalRevenue: 2580000,
        growthRate: 15.8,
        userTrend: 12.5,
        orderTrend: -3.2,
        revenueTrend: 8.7,
      });
      setLoading(false);
    };

    loadData();
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    setStatsData(prev => ({
      ...prev,
      totalUsers: prev.totalUsers + Math.floor(Math.random() * 100),
      totalOrders: prev.totalOrders + Math.floor(Math.random() * 50),
      totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 10000),
      userTrend: (Math.random() - 0.5) * 20,
      orderTrend: (Math.random() - 0.5) * 20,
      revenueTrend: (Math.random() - 0.5) * 20,
    }));
  };

  // 处理快捷操作点击
  const handleQuickAction = (action: typeof quickActions[0]) => {
    try {
      navigate(action.path);
      message.success(`正在跳转到${action.title}页面`);
    } catch (error) {
      message.error(`跳转失败，请检查路由配置`);
      console.error('Navigation error:', error);
    }
  };

  // 销售趋势图配置
  const getSalesChartOption = () => ({
    title: {
      text: '近30天销售趋势',
      left: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['销售额', '订单量'],
      right: 0,
      top: 0
    },
    xAxis: {
      type: 'category',
      data: Array.from({length: 30}, (_, i) => `${i + 1}日`),
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666',
        interval: 4
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额(万)',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5'
          }
        }
      },
      {
        type: 'value',
        name: '订单量',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        yAxisIndex: 0,
        data: Array.from({length: 30}, () => Math.floor(Math.random() * 50 + 20)),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
            ]
          }
        }
      },
      {
        name: '订单量',
        type: 'bar',
        yAxisIndex: 1,
        data: Array.from({length: 30}, () => Math.floor(Math.random() * 200 + 100)),
        itemStyle: {
          color: '#52c41a'
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  });

  // 用户分布饼图配置
  const getUserDistributionOption = () => ({
    title: {
      text: '用户分布',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 50,
      data: ['新用户', '活跃用户', '沉睡用户', '流失用户']
    },
    series: [
      {
        name: '用户分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '60%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 4580, name: '新用户', itemStyle: { color: '#1890ff' } },
          { value: 3200, name: '活跃用户', itemStyle: { color: '#52c41a' } },
          { value: 2800, name: '沉睡用户', itemStyle: { color: '#faad14' } },
          { value: 2000, name: '流失用户', itemStyle: { color: '#ff4d4f' } }
        ]
      }
    ]
  });

  // 产品销量排行配置
  const getProductRankingOption = () => ({
    title: {
      text: '产品销量排行',
      left: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: ['产品E', '产品D', '产品C', '产品B', '产品A'],
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    series: [
      {
        type: 'bar',
        data: [320, 450, 680, 820, 950],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]
          }
        },
        barWidth: '60%'
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  });

  // 访问量趋势配置
  const getVisitTrendOption = () => ({
    title: {
      text: '访问量趋势',
      left: 0,
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e8e8e8'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f5f5f5'
        }
      }
    },
    series: [
      {
        type: 'line',
        data: [120, 80, 150, 300, 280, 450, 200],
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#722ed1'
        },
        itemStyle: {
          color: '#722ed1'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(114, 46, 209, 0.3)' },
              { offset: 1, color: 'rgba(114, 46, 209, 0.05)' }
            ]
          }
        }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 10000) {
      return '¥' + (num / 10000).toFixed(1) + '万';
    }
    return '¥' + num.toLocaleString();
  };

  if (loading) {
    return (
      <div className={styles.homePage}>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      {/* 页面标题 */}
      <div className={styles.pageTitle}>
        <HomeOutlined className={styles.icon} />
        数据概览
        <Button 
          type="text" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          style={{ marginLeft: 'auto' }}
        >
          刷新数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>总用户数</span>
            <div className={`${styles.cardIcon} ${styles.users}`}>
              <UserOutlined />
            </div>
          </div>
          <div className={styles.cardValue}>{formatNumber(statsData.totalUsers)}</div>
          <div className={`${styles.cardTrend} ${statsData.userTrend >= 0 ? styles.positive : styles.negative}`}>
            {statsData.userTrend >= 0 ? <ArrowUpOutlined className={styles.trendIcon} /> : <ArrowDownOutlined className={styles.trendIcon} />}
            {Math.abs(statsData.userTrend).toFixed(1)}% 较上月
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>总订单数</span>
            <div className={`${styles.cardIcon} ${styles.orders}`}>
              <ShoppingCartOutlined />
            </div>
          </div>
          <div className={styles.cardValue}>{formatNumber(statsData.totalOrders)}</div>
          <div className={`${styles.cardTrend} ${statsData.orderTrend >= 0 ? styles.positive : styles.negative}`}>
            {statsData.orderTrend >= 0 ? <ArrowUpOutlined className={styles.trendIcon} /> : <ArrowDownOutlined className={styles.trendIcon} />}
            {Math.abs(statsData.orderTrend).toFixed(1)}% 较上月
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>总营收</span>
            <div className={`${styles.cardIcon} ${styles.revenue}`}>
              <DollarOutlined />
            </div>
          </div>
          <div className={styles.cardValue}>{formatCurrency(statsData.totalRevenue)}</div>
          <div className={`${styles.cardTrend} ${statsData.revenueTrend >= 0 ? styles.positive : styles.negative}`}>
            {statsData.revenueTrend >= 0 ? <ArrowUpOutlined className={styles.trendIcon} /> : <ArrowDownOutlined className={styles.trendIcon} />}
            {Math.abs(statsData.revenueTrend).toFixed(1)}% 较上月
          </div>
        </div>

        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>增长率</span>
            <div className={`${styles.cardIcon} ${styles.growth}`}>
              <RiseOutlined />
            </div>
          </div>
          <div className={styles.cardValue}>{statsData.growthRate.toFixed(1)}%</div>
          <div className={`${styles.cardTrend} ${styles.positive}`}>
            <ArrowUpOutlined className={styles.trendIcon} />
            持续增长
          </div>
        </div>
      </div>

      {/* 主要图表区域 */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            销售数据分析
            <div className={styles.chartActions}>
              <Tag color="blue">实时数据</Tag>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <ReactECharts option={getSalesChartOption()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>用户分布</div>
          <div className={styles.chartContainer}>
            <ReactECharts option={getUserDistributionOption()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* 底部图表 */}
      <div className={styles.bottomCharts}>
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>产品销量排行</div>
          <div className={styles.chartContainer}>
            <ReactECharts option={getProductRankingOption()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>今日访问量趋势</div>
          <div className={styles.chartContainer}>
            <ReactECharts option={getVisitTrendOption()} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className={styles.quickActions}>
        <div className={styles.actionsTitle}>快捷操作</div>
        <div className={styles.actionsList}>
          {quickActions.map((action) => (
            <div 
              key={action.key}
              className={styles.actionItem}
              onClick={() => handleQuickAction(action)}
              title={action.description}
            >
              <div className={styles.actionIcon}>
                {action.icon}
              </div>
              <span className={styles.actionText}>{action.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;