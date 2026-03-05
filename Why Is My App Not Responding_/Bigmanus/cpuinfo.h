}

static inline bool cpuinfo_has_riscv_f(void) {
#if CPUINFO_ARCH_RISCV32 || CPUINFO_ARCH_RISCV64
	return cpuinfo_isa.f;
#else
	return false;
#endif
}

static inline bool cpuinfo_has_riscv_d(void) {
#if CPUINFO_ARCH_RISCV32 || CPUINFO_ARCH_RISCV64
	return cpuinfo_isa.d;
#else
	return false;
#endif
}

static inline bool cpuinfo_has_riscv_g(void) {
	// The 'G' extension is simply shorthand for 'IMAFD'.
	return cpuinfo_has_riscv_i() && cpuinfo_has_riscv_m() && cpuinfo_has_riscv_a() && cpuinfo_has_riscv_f() &&
		cpuinfo_has_riscv_d();
}

static inline bool cpuinfo_has_riscv_c(void) {
#if CPUINFO_ARCH_RISCV32 || CPUINFO_ARCH_RISCV64
	return cpuinfo_isa.c;
#else
	return false;
#endif
}

static inline bool cpuinfo_has_riscv_v(void) {
#if CPUINFO_ARCH_RISCV32 || CPUINFO_ARCH_RISCV64
	return cpuinfo_isa.v;
#else
	return false;
#endif
}

const struct cpuinfo_processor* CPUINFO_ABI cpuinfo_get_processors(void);
const struct cpuinfo_core* CPUINFO_ABI cpuinfo_get_cores(void);
const struct cpuinfo_cluster* CPUINFO_ABI cpuinfo_get_clusters(void);
const struct cpuinfo_package* CPUINFO_ABI cpuinfo_get_packages(void);
const struct cpuinfo_uarch_info* CPUINFO_ABI cpuinfo_get_uarchs(void);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l1i_caches(void);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l1d_caches(void);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l2_caches(void);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l3_caches(void);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l4_caches(void);

const struct cpuinfo_processor* CPUINFO_ABI cpuinfo_get_processor(uint32_t index);
const struct cpuinfo_core* CPUINFO_ABI cpuinfo_get_core(uint32_t index);
const struct cpuinfo_cluster* CPUINFO_ABI cpuinfo_get_cluster(uint32_t index);
const struct cpuinfo_package* CPUINFO_ABI cpuinfo_get_package(uint32_t index);
const struct cpuinfo_uarch_info* CPUINFO_ABI cpuinfo_get_uarch(uint32_t index);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l1i_cache(uint32_t index);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l1d_cache(uint32_t index);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l2_cache(uint32_t index);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l3_cache(uint32_t index);
const struct cpuinfo_cache* CPUINFO_ABI cpuinfo_get_l4_cache(uint32_t index);

uint32_t CPUINFO_ABI cpuinfo_get_processors_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_cores_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_clusters_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_packages_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_uarchs_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_l1i_caches_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_l1d_caches_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_l2_caches_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_l3_caches_count(void);
uint32_t CPUINFO_ABI cpuinfo_get_l4_caches_count(void);

/**
 * Returns upper bound on cache size.
 */
uint32_t CPUINFO_ABI cpuinfo_get_max_cache_size(void);

/**
 * Identify the logical processor that executes the current thread.
 *
 * There is no guarantee that the thread will stay on the same logical processor
 * for any time. Callers should treat the result as only a hint, and be prepared
 * to handle NULL return value.
 */
const struct cpuinfo_processor* CPUINFO_ABI cpuinfo_get_current_processor(void);

/**
 * Identify the core that executes the current thread.
 *
 * There is no guarantee that the thread will stay on the same core for any
 * time. Callers should treat the result as only a hint, and be prepared to
 * handle NULL return value.
 */
const struct cpuinfo_core* CPUINFO_ABI cpuinfo_get_current_core(void);

/**
 * Identify the microarchitecture index of the core that executes the current
 * thread. If the system does not support such identification, the function
 * returns 0.
 *
 * There is no guarantee that the thread will stay on the same type of core for
 * any time. Callers should treat the result as only a hint.
 */
uint32_t CPUINFO_ABI cpuinfo_get_current_uarch_index(void);

/**
 * Identify the microarchitecture index of the core that executes the current
 * thread. If the system does not support such identification, the function
 * returns the user-specified default value.
 *
 * There is no guarantee that the thread will stay on the same type of core for
 * any time. Callers should treat the result as only a hint.
 */
uint32_t CPUINFO_ABI cpuinfo_get_current_uarch_index_with_default(uint32_t default_uarch_index);

#ifdef __cplusplus
} /* extern "C" */
#endif

#endif /* CPUINFO_H */