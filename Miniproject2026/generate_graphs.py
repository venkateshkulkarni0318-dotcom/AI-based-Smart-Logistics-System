import matplotlib.pyplot as plt
import numpy as np

# Set clean aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

print("Generating Figure 1: Latency Comparison...")
# -------------------------------------------------------------
# 1. Latency Comparison Chart
# -------------------------------------------------------------
fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
categories = ['Gateway Routing', 'ML Inference', 'Network Overhead', 'Total Latency']
ai_logix = [11, 7.4, 0, 18.4]
commercial = [350, 450, 1600, 2400]

x = np.arange(len(categories))
width = 0.35

rects1 = ax.bar(x - width/2, ai_logix, width, label='AI-LOGIX (Edge Micro-Gateway)', color='#1d4ed8')
rects2 = ax.bar(x + width/2, commercial, width, label='Commercial Cloud (Locus.sh)', color='#b91c1c')

ax.set_ylabel('Latency in Milliseconds (Logarithmic Scale)', fontsize=11, fontweight='bold')
ax.set_title('Computational Latency: AI-LOGIX Edge vs. Commercial Cloud SaaS', fontsize=12, fontweight='bold', pad=12)
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=10)
ax.set_yscale('log')
ax.grid(True, which='both', linestyle='--', linewidth=0.5, alpha=0.7)

# Value annotations
for rect in rects1:
    h = rect.get_height()
    if h > 0:
        ax.annotate(f'{h} ms', xy=(rect.get_x() + rect.get_width()/2, h),
                    xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=8, fontweight='bold')
for rect in rects2:
    h = rect.get_height()
    ax.annotate(f'{int(h)} ms', xy=(rect.get_x() + rect.get_width()/2, h),
                xytext=(0, 4), textcoords="offset points", ha='center', va='bottom', fontsize=8, fontweight='bold')

ax.legend(frameon=True, facecolor='white', framealpha=0.9)
plt.tight_layout()
plt.savefig('figure1_latency_comparison.png')
plt.close()
print("Saved figure1_latency_comparison.png")

# -------------------------------------------------------------
# 2. Crossover Break-Even Chart
# -------------------------------------------------------------
print("Generating Figure 2: Crossover Break-Even Curve...")
fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
distances = np.array([10, 25, 45, 65, 85, 100])
road_time = np.array([1.5, 3.8, 6.2, 8.5, 11.2, 13.5])
uav_time = np.array([0.15, 0.35, 0.65, 0.92, 1.8, 2.5])

ax.plot(distances, road_time, 'r-o', linewidth=2.5, markersize=7, label='Surface Road Convoy (Mountain Switchbacks)')
ax.plot(distances, uav_time, 'g-s', linewidth=2.5, markersize=7, label='Autonomous Cargo UAV (Direct Air-Drop)')
ax.axvline(x=65, color='#475569', linestyle='--', linewidth=1.5, label='Break-Even Horizon (65 km)')

# Annotate crossover point
ax.annotate('Crossover Horizon (65 km)\nUAV: 55 min vs Road: 8.5 hr', xy=(65, 0.92), xytext=(38, 3.5),
            arrowprops=dict(arrowstyle="->", color='#0f172a', lw=1.5),
            bbox=dict(boxstyle="round,pad=0.3", fc="#fef08a", ec="#ca8a04", lw=1),
            fontweight='bold', fontsize=9)

ax.set_xlabel('Corridor Transit Distance (km)', fontsize=11, fontweight='bold')
ax.set_ylabel('Delivery Transit Duration (Hours)', fontsize=11, fontweight='bold')
ax.set_title('Mountain Transit Time vs. Distance (Zanskar Pass Disaster Scenario)', fontsize=12, fontweight='bold', pad=12)
ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)
ax.legend(frameon=True, facecolor='white', framealpha=0.9)
plt.tight_layout()
plt.savefig('figure2_crossover_curve.png')
plt.close()
print("Saved figure2_crossover_curve.png")

# -------------------------------------------------------------
# 3. Network Availability Chart
# -------------------------------------------------------------
print("Generating Figure 3: Network Availability...")
fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
conditions = ['Full 4G/5G', 'Intermittent 3G', '2G / Edge Only', 'Total Blackout']
ai_logix_avail = [100, 100, 100, 100]
commercial_avail = [100, 65, 20, 0]

ax.plot(conditions, ai_logix_avail, 'g-o', linewidth=2.5, markersize=8, label='AI-LOGIX (100% Offline-First Architecture)')
ax.plot(conditions, commercial_avail, 'r-s', linewidth=2.5, markersize=8, label='Commercial Cloud SaaS (Locus.sh)')

ax.set_ylabel('Operational Availability (%)', fontsize=11, fontweight='bold')
ax.set_title('System Operational Availability vs. Cellular Network Degradation', fontsize=12, fontweight='bold', pad=12)
ax.set_ylim(-5, 110)
ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)

for i, (a, c) in enumerate(zip(ai_logix_avail, commercial_avail)):
    ax.annotate(f'{a}%', xy=(i, a), xytext=(0, 6), textcoords="offset points", ha='center', fontweight='bold', color='green')
    ax.annotate(f'{c}%', xy=(i, c), xytext=(0, -14 if c > 0 else 6), textcoords="offset points", ha='center', fontweight='bold', color='red')

ax.legend(frameon=True, facecolor='white', framealpha=0.9, loc='center left')
plt.tight_layout()
plt.savefig('figure3_network_availability.png')
plt.close()
print("Saved figure3_network_availability.png")

# -------------------------------------------------------------
# 4. Multi-Dimensional Radar / Score Comparison
# -------------------------------------------------------------
print("Generating Figure 4: Capability Comparison Matrix...")
fig, ax = plt.subplots(figsize=(8.5, 4.8), dpi=300)
metrics = [
    'Offline Disaster\nResilience',
    '3D Topographic\nModeling',
    'Explainability\n(TreeSHAP)',
    'Multimodal\nEmergency Fallback',
    'Sub-Second\nLatency',
    'Urban Parcel\nFleet Scale'
]
ai_scores = [100, 95, 95, 90, 98, 35]
locus_scores = [15, 25, 30, 20, 45, 95]

y = np.arange(len(metrics))
height = 0.35

rects_ai = ax.barh(y - height/2, ai_scores, height, label='AI-LOGIX (Disaster Command Platform)', color='#1d4ed8')
rects_locus = ax.barh(y + height/2, locus_scores, height, label='Commercial Platform (Locus.sh)', color='#94a3b8')

ax.set_xlabel('Capability Score (0 - 100)', fontsize=11, fontweight='bold')
ax.set_title('Multi-Dimensional System Capability Comparison', fontsize=12, fontweight='bold', pad=12)
ax.set_yticks(y)
ax.set_yticklabels(metrics, fontsize=9.5)
ax.set_xlim(0, 115)
ax.grid(True, linestyle='--', linewidth=0.5, alpha=0.7)

for rect in rects_ai:
    w = rect.get_width()
    ax.annotate(f'{int(w)}', xy=(w, rect.get_y() + rect.get_height()/2),
                xytext=(4, 0), textcoords="offset points", ha='left', va='center', fontsize=9, fontweight='bold', color='#1d4ed8')
for rect in rects_locus:
    w = rect.get_width()
    ax.annotate(f'{int(w)}', xy=(w, rect.get_y() + rect.get_height()/2),
                xytext=(4, 0), textcoords="offset points", ha='left', va='center', fontsize=9, fontweight='bold', color='#475569')

ax.legend(frameon=True, facecolor='white', framealpha=0.9, loc='lower right')
plt.tight_layout()
plt.savefig('figure4_capability_matrix.png')
plt.close()
print("Saved figure4_capability_matrix.png")

print("\n[SUCCESS] All 4 publication-quality graph figures generated successfully!")

