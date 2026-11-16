/** Frozen snapshots transcribed from executed QuantumOptLab research notebooks.
 * These numbers are not recomputed in the browser. See PROVENANCE.md.
 */
export type GraphId = 'cycle_4' | 'weighted_5' | 'weighted_6';
export type Depth = 1 | 2;
export type Topology = 'unrestricted' | 'ring' | 'line';
export type OptLevel = 0 | 2;
export type GraphDefinition = {
  id: GraphId; label: string; nodes: number; optimum: number;
  edges: [number,number,number][];
  qaoa: Record<Depth, { expected: number; success: number }>;
};
export const graphs: GraphDefinition[] = [
  { id: 'cycle_4', label: 'Cycle 4', nodes: 4, optimum: 4,
    edges: [[0,1,1],[1,2,1],[2,3,1],[3,0,1]],
    qaoa: { 1:{expected:3.0,success:.5312}, 2:{expected:4.0,success:1.0} } },
  { id: 'weighted_5', label: 'Weighted 5', nodes: 5, optimum: 7,
    edges: [[0,1,1],[0,2,2],[1,2,1],[1,3,1],[2,3,2],[2,4,1],[3,4,1]],
    qaoa: { 1:{expected:5.8695,success:.344}, 2:{expected:5.8695,success:.344} } },
  { id: 'weighted_6', label: 'Weighted 6', nodes: 6, optimum: 10,
    edges: [[0,1,1],[1,2,2],[2,3,1],[3,4,2],[4,5,1],[5,0,2],[0,2,1],[1,4,1],[3,5,1]],
    qaoa: { 1:{expected:6.6060,success:.113}, 2:{expected:8.9231,success:.532} } },
];
export const noiseStudy = [
  { cx: 0, benefit: 0.0854, low: 0.0561, high: 0.1186, p2Share: 1.00 },
  { cx: 0.02, benefit: 0.0425, low: 0.0173, high: 0.0698, p2Share: 0.65 },
  { cx: 0.05, benefit: 0.0100, low: -0.0087, high: 0.0314, p2Share: 0.50 },
  { cx: 0.10, benefit: -0.0105, low: -0.0241, high: 0.0038, p2Share: 0.25 },
];
export const policies = [
  { id:'oracle',name:'Oracle upper bound',utility:.72904,ratio:.75017,cx:42.25,note:'Non-deployable hindsight reference' },
  { id:'gate',name:'Gate-budget rule',utility:.71814,ratio:.73832,cx:40.35,note:'Best deployable locked-test utility' },
  { id:'lookup',name:'Noise lookup',utility:.71809,ratio:.73811,cx:40.05,note:'Simple development-derived rule' },
  { id:'p1',name:'Always p=1',utility:.70870,ratio:.72355,cx:29.70,note:'Shallow fixed-depth baseline' },
  { id:'forest',name:'Random Forest',utility:.70511,ratio:.72614,cx:42.06667,note:'Frozen learned selector' },
  { id:'p2',name:'Always p=2',utility:.69939,ratio:.72909,cx:59.40,note:'Deeper fixed-depth baseline' },
];
export const selectorIntervals = [
  { compared:'Always p=1',gain:-.00359,low:-.02929,high:.01525 },
  { compared:'Always p=2',gain:.00572,low:-.00370,high:.01441 },
  { compared:'Noise lookup',gain:-.01298,low:-.02407,high:-.00407 },
  { compared:'Gate-budget rule',gain:-.01303,low:-.02412,high:-.00415 },
];
export const compiled: Record<Topology, Record<OptLevel, Record<Depth,{cx:number;depth:number}>>> = {
  unrestricted: {0:{1:{cx:29.7,depth:30.60},2:{cx:59.4,depth:53.80}},2:{1:{cx:25.90,depth:27.30},2:{cx:54.40,depth:50.15}}},
  ring: {0:{1:{cx:81.75,depth:64.30},2:{cx:160.80,depth:117.10}},2:{1:{cx:47.40,depth:52.85},2:{cx:103.45,depth:109.35}}},
  line: {0:{1:{cx:103.35,depth:76.65},2:{cx:202.05,depth:138.80}},2:{1:{cx:50.75,depth:59.80},2:{cx:121.55,depth:121.90}}},
};
export const researchStats = { totalGraphs:80, trainGraphs:40, validationGraphs:20, testGraphs:20, trainAerRuns:1440, lockedTestAerRuns:720, compiledCircuits:240 } as const;
export const formatPct = (x:number, decimals=1) => `${(x*100).toFixed(decimals)}%`;
