---
title: "让物体自己“发光”：X 射线荧光 CT 入门"
date: 2026-11-09
description: "从内壳层电离和特征 X 射线讲起，介绍 X 射线荧光 CT（XFCT）的基本原理、成像几何、主要挑战与重建思路。"
tags: ["科研", "CT", "XFCT"]
draft: false
math: true
toc: true
---

普通 CT 回答的问题是：物体里每个位置“挡住”了多少 X 射线。它看的是衰减，而衰减主要由密度和原子序数决定。可如果我们关心的是某一种特定元素在哪里、有多少，比如体内的一种金纳米颗粒探针或者含钆造影剂，衰减图像就不太够用了：低浓度的元素在衰减图里几乎看不出来。

X 射线荧光 CT（X-ray fluorescence computed tomography，XFCT）换了一个角度。它不只看穿过物体的射线，而是去收集物体被照射后“自己发出”的特征 X 射线。这篇文章是一份入门介绍，讲讲它的物理原理、成像方式和主要困难。

## 特征 X 射线：元素的“指纹”

当入射光子能量高于某种原子 K 层电子的结合能（即 K 吸收边）时，它可能通过光电效应把一个 K 层电子打出去。原子留下一个内层空位，外层电子随即跃迁下来填补，多余的能量要么以俄歇电子的形式带走，要么以一个光子的形式发射出来。后一种光子就是特征 X 射线，也叫荧光 X 射线。

特征 X 射线的能量由原子的能级结构决定，因此每种元素都有一组独特的谱线。以金为例，它的 K 吸收边约为 80.7 keV，L 层电子跃迁到 K 层发出的 Kα 线约在 67–69 keV；钆的 K 吸收边约为 50.2 keV，Kα 线约在 43 keV。只要探测器能分辨能量，看到哪条谱线，就知道是哪种元素；谱线强度，则与该元素的含量有关。

荧光发射还有一个重要特点：它近似各向同性，向各个方向发出。这一点既带来了灵活性，也带来了困难，后面会再提到。

## XFCT 如何定位荧光的来源

光知道“有荧光”还不够，CT 需要知道荧光来自哪里。最直观的一种几何是笔形束扫描：用很细的一束 X 射线穿过物体，这条射线经过的路径上，凡是含有目标元素的位置都会发出荧光；在旁边放一个能量分辨探测器，记录荧光谱线的强度。然后像第一代 CT 那样平移、旋转，得到一组“沿着每条射线的荧光总量”，再用重建算法恢复元素浓度的空间分布。

XFCT 的思路最早可以追溯到上世纪八十年代末 Cesareo 和 Mascarenhas 的工作 [1]。早期研究很多依赖同步辐射光源，因为单色、高通量的光束便于激发和分析。后来，人们开始探索用常规 X 射线管实现台式 XFCT，例如 Cheong 等人用 110 kVp 的多色射线对含金纳米颗粒的模体进行成像 [2]，Jones 和 Cho 则用蒙特卡罗模拟研究了锥束 XFCT 的可行性 [3]。

除了笔形束，还有扇束、锥束配合准直器或针孔的方案，用探测器一侧的准直来限定“哪里来的荧光能被哪个像素看到”，以牺牲部分探测效率换取更快的采集。

## 一个简化的前向模型

把物理过程写下来，有助于看清重建要解什么问题。设入射射线沿路径 $L$ 前进，路径上一点 $\mathbf{x}$ 处目标元素的浓度为 $c(\mathbf{x})$。忽略许多细节后，探测器记录到的荧光信号可以写成

$$
F \propto \int_L I_0\, e^{-A_{\mathrm{in}}(\mathbf{x})}\, \mu_{\mathrm{ph}}(E_0)\, c(\mathbf{x})\, \omega_K\, \frac{\Omega(\mathbf{x})}{4\pi}\, e^{-A_{\mathrm{out}}(\mathbf{x})}\, \mathrm{d}l ,
$$

其中 $A_{\mathrm{in}}$ 是入射射线从入口到 $\mathbf{x}$ 的累积衰减，$\mu_{\mathrm{ph}}$ 是单位浓度下的光电吸收系数，$\omega_K$ 是 K 层荧光产额，$\Omega/4\pi$ 是探测器所张立体角占全空间的比例，$A_{\mathrm{out}}$ 是荧光从 $\mathbf{x}$ 飞向探测器途中的衰减。

这个式子里有两层信息。第一，在衰减已知的情况下，信号对浓度 $c$ 是线性的，问题和发射断层成像很像，可以借用 ML-EM 等统计重建方法 [4]。第二，入射和出射两段衰减都与物体本身有关，所以准确的 XFCT 重建往往需要同时知道物体的衰减分布，通常借助同步采集的透射 CT 来做衰减校正。

## 主要困难

**信号弱。** 荧光向四面八方发射，探测器只能接住其中一小部分立体角；再加上低浓度时本身产生的荧光光子就少，统计噪声是绕不开的问题。

**散射背景强。** 入射射线在物体中同样会发生康普顿散射，散射光子的能量分布可能与荧光谱线重叠。用多色 X 射线管时，这个背景尤其明显。如何在能谱上把荧光峰从散射背景中提取出来，是台式 XFCT 的核心问题之一。探测器的摆放角度、能量分辨率、准直设计都会影响信噪比。Ahmad 等人的研究表明，通过优化探测器的空间和能谱配置、调整探测器角度，可以显著提升 XFCT 的灵敏度 [5, 6]。

**剂量与时间。** 为了积累足够的荧光计数，笔形束扫描往往需要较长时间或较高剂量。提高采集效率与控制剂量之间的平衡，决定了它离实际应用有多远。

## 它和能谱 CT 有什么不同

能谱 CT 同样可以利用 K 吸收边识别元素，但它测的仍然是透射衰减，元素信号需要从整体衰减中“减”出来。XFCT 测的是元素主动发出的特征信号，背景主要来自散射，而不是来自整个物体的衰减。两者在原理上互补，适用的浓度范围、剂量水平和系统复杂度也各不相同。

## 写在最后

XFCT 的魅力在于，它把“元素识别”这件化学分析的事情变成了一个断层成像问题。它也把成像中许多经典难题集中到了一起：弱信号统计、散射背景、衰减校正、系统几何设计和逆问题求解。正因为如此，它是一个很适合用来理解“测量模型如何决定成像能力”的例子。

## 参考文献

1. R. Cesareo, S. Mascarenhas. A new tomographic device based on the detection of fluorescent x-rays. *Nuclear Instruments and Methods in Physics Research Section A* 277, 669–672 (1989). [DOI](https://doi.org/10.1016/0168-9002(89)90802-4)
2. S.-K. Cheong, B. L. Jones, A. K. Siddiqi, F. Liu, N. Manohar, S. H. Cho. X-ray fluorescence computed tomography (XFCT) imaging of gold nanoparticle-loaded objects using 110 kVp x-rays. *Physics in Medicine & Biology* 55(3), 647–662 (2010). [DOI](https://doi.org/10.1088/0031-9155/55/3/007)
3. B. L. Jones, S. H. Cho. The feasibility of polychromatic cone-beam x-ray fluorescence computed tomography (XFCT) imaging of gold nanoparticle-loaded objects: a Monte Carlo study. *Physics in Medicine & Biology* 56(12), 3719–3730 (2011). [DOI](https://doi.org/10.1088/0031-9155/56/12/017)
4. L. A. Shepp, Y. Vardi. Maximum Likelihood Reconstruction for Emission Tomography. *IEEE Transactions on Medical Imaging* 1(2), 113–122 (1982). [DOI](https://doi.org/10.1109/TMI.1982.4307558)
5. M. Ahmad, M. Bazalova, L. Xiang, L. Xing. Order of Magnitude Sensitivity Increase in X-ray Fluorescence Computed Tomography (XFCT) Imaging With an Optimized Spectro-Spatial Detector Configuration: Theory and Simulation. *IEEE Transactions on Medical Imaging* 33(5), 1119–1128 (2014). [DOI](https://doi.org/10.1109/TMI.2014.2305101)
6. M. Ahmad, M. Bazalova-Carter, R. Fahrig, L. Xing. Optimized Detector Angular Configuration Increases the Sensitivity of X-ray Fluorescence Computed Tomography (XFCT). *IEEE Transactions on Medical Imaging* 34(5), 1140–1147 (2015). [DOI](https://doi.org/10.1109/TMI.2014.2376813)
