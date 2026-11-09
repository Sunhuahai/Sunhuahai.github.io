---
title: "CT 图像里的“雾”：X 射线散射从哪里来，又该怎么校正"
date: 2026-11-09
description: "从康普顿散射和 Klein–Nishina 公式出发，梳理 CT 散射伪影的成因、经典校正方法，以及物理先验为什么能帮助深度网络。"
tags: ["科研", "CT", "散射校正"]
draft: false
math: true
toc: true
---

拍过锥束 CT 的人大概都见过这样的图像：中间偏暗、边缘偏亮，像一只浅浅的碗；本该均匀的组织出现条纹，软组织之间的对比度也被“冲淡”了。这些问题有很多来源，其中最顽固的一个，是 X 射线散射。它像一层雾，均匀地罩在投影上，不容易直接看出来，却会实实在在地改变重建出来的数值。

这篇文章想把散射这件事从头讲清楚：它从哪里来，为什么会让 CT 值出错，人们用过哪些办法对付它，以及为什么近几年越来越多的工作强调把物理规律放进深度网络。

## CT 默认“每条射线都走直线”

CT 重建的出发点是 Beer–Lambert 定律。一束强度为 $I_0$ 的射线穿过物体，沿直线路径 $L$ 衰减，探测器上得到的原射线强度为

$$
P = I_0 \exp\left(-\int_L \mu(\mathbf{x})\,\mathrm{d}l\right).
$$

取对数之后，就得到线积分 $-\ln(P/I_0)$，许多重建算法正是从这些线积分出发，反推出衰减系数分布 $\mu(\mathbf{x})$。

这个模型隐含一个前提：落到某个探测器单元上的光子，都是沿着源到该单元的直线走过来的。散射恰恰破坏了这个前提。

## 散射光子从哪里来

在诊断能量范围内，X 射线与物质的主要相互作用是光电效应和康普顿散射，另有少量相干（瑞利）散射。光电效应把光子吸收掉，康普顿散射则让光子改变方向、损失一部分能量后继续前进。

康普顿散射的角分布由 Klein–Nishina 公式描述 [9]。对能量为 $E$ 的入射光子，散射角为 $\theta$ 时，散射光子能量为

$$
E' = \frac{E}{1 + \dfrac{E}{m_e c^2}(1-\cos\theta)},
$$

单个自由电子的微分截面为

$$
\frac{\mathrm{d}\sigma}{\mathrm{d}\Omega} = \frac{r_e^2}{2}\left(\frac{E'}{E}\right)^2\left(\frac{E'}{E} + \frac{E}{E'} - \sin^2\theta\right),
$$

其中 $r_e$ 是经典电子半径。这个公式告诉我们两件事：散射光子会以一定概率飞向各个方向，而且它的角度分布和能量之间有确定的物理关系。对 CT 来说，前一点意味着麻烦，后一点则意味着散射并不是无规律的噪声，而是可以被建模的信号。

## 散射为什么会让 CT 值出错

探测器分不清哪些光子走的是直线、哪些是被散射过来的，它测到的是 $P + S$，其中 $S$ 是散射信号。于是我们实际计算的是

$$
-\ln\frac{P+S}{I_0} < -\ln\frac{P}{I_0}.
$$

散射让线积分系统性地偏小，而且穿过物体越厚、原射线越弱的地方，散射相对占比越高，偏差越大。重建之后，这种偏差就表现为杯状伪影、高衰减物体之间的暗条纹、对比度下降以及 CT 值偏移。

扇束 CT 的准直较窄，散射问题相对可控；锥束 CT 一次照射的体积大，平板探测器又会同时接收大量散射，问题就严重得多。Siewerdsen 和 Jaffray 早在 2001 年就系统测量过平板锥束 CT 中散射的大小及其影响，结果显示在较大视野和较厚物体下，散射与原射线之比可以相当可观 [1]。

## 经典的校正思路

Rührnschopf 和 Klingenbeck 的综述把散射校正方法做了系统梳理 [2]。粗略地说，可以分成三类。

**第一类是在硬件上少接收散射。** 例如防散射栅、加大物体与探测器之间的空气间隙、收窄准直。它们直接有效，但会损失一部分原射线、增加剂量需求，或受到系统几何的限制。

**第二类是测量散射。** 典型做法是在射线源和物体之间放一组铅块阵列（beam stop array）。铅块后方原射线被挡住，探测器测到的基本就是散射；由于散射在空间上变化比较平缓，可以用这些采样点插值出整幅散射分布，再从投影中扣除 [3]。这种方法比较直接，常被用来提供参考，但需要额外采集，临床流程中并不方便。

**第三类是计算散射。** 最严格的是蒙特卡罗模拟：按照物理截面逐个追踪光子，精度高但计算量大；更快的是核卷积类方法，把散射近似为投影与某个散射核的卷积，速度快，但对复杂物体的近似有限。

## 深度学习：快，但会“抄近路”

近几年，深度网络被用来直接从投影估计散射。Maier 等人提出的 deep scatter estimation 用蒙特卡罗模拟数据训练网络，在保持实时速度的同时获得接近蒙特卡罗的精度，并专门分析了对不同解剖部位、剂量和管电压的鲁棒性 [4]。

纯数据驱动的方法有一个隐忧：网络学到的未必是散射物理，而可能是训练数据中某些部位特有的“捷径”。换一个解剖部位、换一种扫描条件，性能就可能下降。而真实的无散射参考数据又很难大量获取，这让“多采数据”这条路并不轻松。

## 把物理放进网络

一个自然的想法是：既然 Klein–Nishina 公式已经告诉我们散射的角度规律，为什么不把它作为先验交给网络？

我参与的论文 ScatterFusionNet 就是沿着这个思路展开的 [5]。按照论文摘要，它面向双探测器 CT：把侧方探测器的测量与多尺度主干网络融合，并用 Klein–Nishina 先验图通过特征级线性调制（FiLM）引导网络特征 [6]。FiLM 的形式很简单，对第 $c$ 个特征通道做

$$
\tilde{F}_c = \gamma_c \odot F_c + \beta_c,
$$

其中 $\gamma_c$ 和 $\beta_c$ 由条件信息生成。在这里，条件信息来自物理先验，于是物理规律不是作为一个额外的损失项“事后惩罚”，而是直接参与调节网络内部的表示。

论文中模型先用蒙特卡罗模拟训练，再用少量实测数据微调，并在训练时没有见过的解剖部位上评估，结果与 beam stop array 参考接近，跨部位泛化明显好于同等训练条件下的常规基线。具体数据可以查看原文。

沿着同一方向，我们在 Fully3D 2025 上做了题为 DiffuCoCT 的口头报告，尝试用扩散模型做双探测器 CT 的散射校正 [7]。扩散模型通过逐步加噪和学习逐步去噪来刻画数据分布 [8]，这为在散射校正中引入生成式先验提供了另一种可能。

## 写在最后

散射校正看起来是一个“修图”问题，本质上却是一个测量模型问题：我们的重建算法假设了一个过于理想的物理过程，散射就是现实与假设之间的差。硬件、测量、模拟和学习，都是在用不同方式补上这段差距。我越来越觉得，深度网络最有价值的地方不是替代物理，而是在物理已经说清楚的部分之外，去学习那些难以显式建模的细节。

## 参考文献

1. J. H. Siewerdsen, D. A. Jaffray. Cone-beam computed tomography with a flat-panel imager: Magnitude and effects of x-ray scatter. *Medical Physics* 28(2), 220–231 (2001). [DOI](https://doi.org/10.1118/1.1339879)
2. E.-P. Rührnschopf, K. Klingenbeck. A general framework and review of scatter correction methods in x-ray cone-beam computerized tomography. Part 1: Scatter compensation approaches. *Medical Physics* 38(7), 4296–4311 (2011). [DOI](https://doi.org/10.1118/1.3599033)
3. R. Ning, X. Tang, D. Conover. X-ray scatter correction algorithm for cone beam CT imaging. *Medical Physics* 31(5), 1195–1202 (2004). [DOI](https://doi.org/10.1118/1.1711475)
4. J. Maier et al. Real-time scatter estimation for medical CT using the deep scatter estimation: Method and robustness analysis with respect to different anatomies, dose levels, tube voltages, and data truncation. *Medical Physics* 46(1), 238–249 (2019). [DOI](https://doi.org/10.1002/mp.13274)
5. H. Sun, W. Zhang, L. Li. ScatterFusionNet: physics-informed deep scatter correction for dual-detector CT using Klein–Nishina prior. *Physics in Medicine & Biology* 71(10), 105027 (2026). [DOI](https://doi.org/10.1088/1361-6560/ae6af7)
6. E. Perez, F. Strub, H. de Vries, V. Dumoulin, A. Courville. FiLM: Visual Reasoning with a General Conditioning Layer. *AAAI* 32 (2018). [DOI](https://doi.org/10.1609/aaai.v32i1.11671)
7. H. Sun, W. Zhang, L. Li. DiffuCoCT: Dual-Domain Collaborative Diffusion Network for Dual-Detector CT Scatter Correction. Fully3D 2025, Shanghai, oral. [会议程序](https://hqlab.sjtu.edu.cn/fully3d-2025/program)
8. J. Ho, A. Jain, P. Abbeel. Denoising Diffusion Probabilistic Models. *NeurIPS* (2020). [arXiv:2006.11239](https://arxiv.org/abs/2006.11239)
9. O. Klein, Y. Nishina. Über die Streuung von Strahlung durch freie Elektronen nach der neuen relativistischen Quantendynamik von Dirac. *Zeitschrift für Physik* 52, 853–868 (1929). [DOI](https://doi.org/10.1007/BF01366453)
