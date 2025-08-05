# Azure DevOps Setup Guide

This document provides instructions for setting up the Playwright Allure Automation Framework in Azure DevOps.

## Prerequisites

### 1. Azure DevOps Extensions

Install the following extensions from the Azure DevOps Marketplace:

- **Allure Report** by Qameta Software
  - URL: https://marketplace.visualstudio.com/items?itemName=qameta.allure
  - Required for PublishAllureReport@1 task

### 2. Service Connections (if needed)

- None required for DemoQA tests (public site)
- Add service connections for private test environments if applicable

## Pipeline Configuration

### Variables

The pipeline uses the following variables that can be overridden:

```yaml
variables:
  - name: nodeVersion
    value: '18.x'
  - name: dockerImageName
    value: 'playwright-allure-automation'
  - name: allureVersion
    value: '2.30.0'
  - name: ENVIRONMENT
    value: 'prod'
  - name: BASE_URL
    value: 'https://demoqa.com'
  - name: HEADLESS
    value: 'true'
  - name: CI
    value: 'true'
```

### Worker Configuration

- **Local Development**: 6 workers (optimal performance)
- **CI Environment**: 3 workers (stability focused)
- **Smoke Tests**: 2 workers (fast feedback)

### Test Execution Strategy

1. **Build Stage**: Code validation and dependency installation
2. **Test Stage**: Multi-platform execution
   - Docker tests (Linux container)
   - Multi-browser smoke tests (Chrome, Firefox, Safari)
   - Full regression suite
   - Windows compatibility tests
3. **Report Stage**: Consolidated Allure report generation
4. **Publish Stage**: Report publication to Azure DevOps

## Setting Up the Pipeline

### 1. Create Pipeline

1. Go to Azure DevOps → Pipelines → New Pipeline
2. Select your repository
3. Choose "Existing Azure Pipelines YAML file"
4. Select `/azure-pipelines.yml`

### 2. Configure Build Agents

#### Option A: Microsoft-hosted agents (Recommended)
- Uses `ubuntu-latest` for Linux jobs
- Uses `windows-latest` for Windows jobs
- No additional setup required

#### Option B: Self-hosted agents
- Install Node.js 18.x
- Install Docker (for Docker-based tests)
- Install Playwright dependencies

### 3. Pipeline Permissions

Ensure the pipeline has permissions to:
- Read source code
- Publish artifacts
- Publish test results
- Download artifacts

## Artifacts Generated

### Test Results
- **JUnit XML**: Published to Azure DevOps test results
- **Allure JSON**: Raw test results for report generation

### Reports
- **allure-html-report**: Complete HTML report (downloadable)
- **allure-results-combined**: Raw results for debugging
- **playwright-report**: Native Playwright HTML report

### Logs and Screenshots
- Test execution logs
- Screenshots on failure
- Videos on failure (CI environment)
- Traces on failure (CI environment)

## Customization

### Adding New Test Environments

Add environment-specific variables:

```yaml
- name: STAGING_URL
  value: 'https://staging.demoqa.com'
- name: DEV_URL
  value: 'https://dev.demoqa.com'
```

### Browser Configuration

Modify the browser matrix in smoke tests:

```yaml
strategy:
  matrix:
    Chrome:
      BROWSER: 'chromium'
    Firefox:
      BROWSER: 'firefox'
    Safari:
      BROWSER: 'webkit'
    Edge:
      BROWSER: 'msedge'  # Add Microsoft Edge
```

### Notification Setup

Add notification steps to the final stage:

```yaml
- task: Office365Connector@0
  inputs:
    webhookUrl: '$(TeamsWebhookUrl)'
    name: 'Test Execution Completed'
    status: '$(Agent.JobStatus)'
```

## Troubleshooting

### Common Issues

#### 1. PublishAllureReport@1 Task Not Found
**Solution**: Install the Allure extension from Azure DevOps Marketplace

#### 2. Docker Build Failures
**Solutions**:
- Ensure Docker is available on the build agent
- Check Dockerfile syntax
- Verify base image availability

#### 3. Browser Installation Timeouts
**Solutions**:
- Use `--with-deps` flag for system dependencies
- Increase timeout values
- Use cached browser installations

#### 4. Memory Issues on Agents
**Solutions**:
- Reduce worker count (from 6 to 3 or 2)
- Use `continueOnError: true` for non-critical stages
- Split large test suites into smaller chunks

### Performance Optimization

#### 1. Caching
- NPM packages are cached using Cache@2 task
- Browser binaries can be cached for self-hosted agents

#### 2. Parallel Execution
- Tests run in parallel within each job
- Multiple jobs run simultaneously across different agents

#### 3. Artifact Management
- Large artifacts are compressed
- Unnecessary files are excluded via .gitignore

## Monitoring and Metrics

### Key Metrics to Track

1. **Build Duration**: Target < 15 minutes total
2. **Test Success Rate**: Target > 95%
3. **Flaky Test Rate**: Target < 5%
4. **Coverage**: Track test coverage over time

### Dashboard Integration

Create custom dashboards showing:
- Test execution trends
- Browser compatibility results
- Performance metrics
- Failure analysis

## Security Considerations

### Secrets Management
- Use Azure Key Vault for sensitive data
- Store API keys in variable groups
- Mark sensitive variables as secret

### Code Security
- Dependency vulnerability scanning
- Code quality gates
- Security scanning in pipelines

## Advanced Features

### Conditional Execution
- Skip stages based on file changes
- Different strategies for PR vs main branch
- Environment-specific test suites

### Integration with Work Items
- Link test results to Azure DevOps work items
- Automatic bug creation on test failures
- Traceability from requirements to tests

### Deployment Gates
- Use test results as deployment gates
- Quality gates based on test coverage
- Automated rollback on test failures

---

## Support

For pipeline issues:
1. Check Azure DevOps logs
2. Review artifact contents
3. Validate environment variables
4. Test locally with same configuration

For test issues:
1. Download test artifacts
2. Review Allure reports
3. Check screenshots and videos
4. Analyze trace files
