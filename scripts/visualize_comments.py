import matplotlib.pyplot as plt
import pandas as pd

# Set font for Chinese support (using a common one on macOS)
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']
plt.rcParams['axes.unicode_minus'] = False

# Data based on analyzed comments
categories = ['身份切割 (Distancing)', '经济生计 (Economy)', '政治标签 (Labels)', '局势观望 (Observation)', '其他 (Others)']
counts = [12, 8, 6, 4, 3]

df = pd.DataFrame({'Category': categories, 'Count': counts})

# Create the plot
plt.figure(figsize=(10, 6))
colors = ['#ff9999','#66b3ff','#99ff99','#ffcc99', '#c2c2f0']
plt.bar(df['Category'], df['Count'], color=colors)

plt.title('抖音视频评论区舆论分布统计\n"美国对伊朗动手"相关视频', fontsize=15)
plt.xlabel('评论类别', fontsize=12)
plt.ylabel('评论频率 (样本量 ~35)', fontsize=12)
plt.grid(axis='y', linestyle='--', alpha=0.7)

# Add text labels on bars
for i, v in enumerate(df['Count']):
    plt.text(i, v + 0.2, str(v), ha='center', fontweight='bold')

plt.tight_layout()
plt.savefig('comment_analysis.png')
print("Chart saved as comment_analysis.png")
