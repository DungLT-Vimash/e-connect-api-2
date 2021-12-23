'use strict';

module.exports = {
    application: {
        services: {
            webAdminEmployee: {
                methods: {
                    editEmployees: {
                        mocking: {
                            mappings: {
                                default: {
                                    selector: function (data = {}) {
                                        return true;
                                    },
                                    generate: function (data = {}) {
                                        return Promise.resolve({
                                            status : 200,
                                            msg : 'Mocking api editEmployees'
                                        });
                                    }
                                }
                            }
                        }
                    },
                    createEmployee: { 
                        mocking: {
                            mappings: {
                                default: {
                                    selector: function (data = {}) {
                                        return true;
                                    },
                                    generate: function (data = {}) {
                                        return Promise.resolve({
                                            status : 200,
                                            msg : 'Mocking api createEmployee'
                                        });
                                    }
                                }
                            }
                        }
                    },
                    listEmployees: {
                        mocking: {
                            mappings: {
                                default: {
                                    selector: function (data = {}) {
                                        return true;
                                    },
                                    generate: function (data = {}) {
                                        return Promise.resolve({
                                            status : 200,
                                            msg : 'Mocking api listEmployees'
                                        });
                                    }
                                }
                            }
                        }
                    },
                    searchEmployees: {
                        mocking: {
                            mappings: {
                                default: {
                                    selector: function (data = {}) {
                                        return true;
                                    },
                                    generate: function (data = {}) {
                                        return Promise.resolve({
                                            status : 200,
                                            msg : 'Mocking api searchEmployees'
                                        });
                                    }
                                }
                            }
                        }
                    },
                }
            }
        }
    }
};
